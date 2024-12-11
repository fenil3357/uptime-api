import { NextFunction, Request, Response } from "express";
import { AuthProvider } from "@prisma/client";

import { ConflictError, CustomError, TooManyRequestsError } from "../../helper/errors/custom-errors.js";
import { httpStatusCodes } from "../../constant/httpStatus/httpStatusCodes.constants.js";
import { handleResponse } from "../../helper/response/handleResponse.js";

import { createUser, deleteOneUser, getOneUser } from "../../services/database/user/user.service.js";
import { generateHtmlTemplateForEmailVerification } from "../../services/email/email.templates.js";
import { sendEmailService } from "../../services/email/email.service.js";

export const createUserController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { name, email, password } = req?.body;

    // Check if user already exist
    const ifUserExists = await getOneUser({
      email
    }, {
      createdAt: true,
      email_verified: true
    });

    if (ifUserExists) {
      // If user already exists and verified
      if (ifUserExists?.email_verified) {
        throw new ConflictError('This user already exists');
      }

      // If user was created within time span of 1 hour
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - (1 * 60 * 60 * 1000));

      if ((ifUserExists?.createdAt || new Date()) >= oneHourAgo) {
        throw new TooManyRequestsError("We've already sent you a verification link on your email. If you didn't received it then try again after some time");
      }
      else {
        // If user was not created within last 1 hour then delete the old user
        await deleteOneUser({ email });
      }
    }

    // Create new user
    const newUser = await createUser({
      name,
      email,
      password,
      auth_provider: AuthProvider.EMAIL_PASSWORD,  // email-password authentication
    });

    // Send verification email
    const html_template_for_verification_email = generateHtmlTemplateForEmailVerification({
      name,
      link: 'www.google.com'
    });

    await sendEmailService({
      from: 'info@citynect.in',
      to: 'najad10517@regishub.com',
      html: '<p> Test </P>',
      subject: 'Verify Your Email'
    })

    return handleResponse(res,
      {
        message: 'New user created successfully',
        data: {
          id: newUser?.id,
          name: newUser?.name,
          email: newUser?.email
        }
      }, httpStatusCodes['Created']);
  } catch (error: any) {
    console.log("🚀 ~ createUserController ~ error:", error?.message || error, error?.statusCode)
    return next(
      new CustomError(
        error?.message || 'Something went wrong while creating a new user',
        error?.statusCode || httpStatusCodes['Internal Server Error']
      )
    )
  }
}