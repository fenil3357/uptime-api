import { NextFunction, Request, Response } from "express";
import { google } from "googleapis";

import { BadRequestError, CustomError, UnAuthorizationError } from "../../helper/errors/custom-errors.js";
import { httpStatusCodes } from "../../constant/httpStatus/httpStatusCodes.constants.js";
import { generateOauth2Client, oauth2ClientGoogleAuth } from "../../config/google/oauth2Client.config.js";
import { GOOGLE_OAUTH_LOGIN_SCOPES } from "../../constant/google-auth/google-auth.constants.js";
import { handleResponse } from "../../helper/response/handleResponse.js";
import { createUser, getOneUser, updateOneUser } from "../../services/database/user/user.service.js";
import { generateToken } from "../../services/jwt/jwt.js";
import { decryption, encryption } from "../../services/encryption/encryption.js";
import { ENV_VALUES } from "../../config/env/env.config.js";

export const googleAuthController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    let redirectUrl = req?.query?.redirect;

    const googleAuthUrl: string = oauth2ClientGoogleAuth.generateAuthUrl({
      access_type: 'offline',
      scope: GOOGLE_OAUTH_LOGIN_SCOPES,
      state: JSON.stringify({
        redirect: redirectUrl?.toString() || undefined
      })
    })

    return handleResponse(
      res,
      {
        message: 'Google auth url fetched successfully',
        data: {
          authUrl: googleAuthUrl
        }
      },
      httpStatusCodes['OK']
    );
  } catch (error: any) {
    console.log("🚀 ~ googleAuthController ~ error:", error?.message || error, error?.statusCode)
    return next(
      new CustomError(
        error?.message || 'Something went wrong! please try again.',
        error?.statusCode || httpStatusCodes['Internal Server Error']
      )
    )
  }
}

export const googleAuthCallbackController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const code = req?.query?.code;
    // const state: any = req?.query?.state;
    // const stateData = JSON.parse(state);

    if (!code) return next(new UnAuthorizationError('Code not provided'));

    const oauth2Client = generateOauth2Client();
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    const { data } = await google.oauth2("v2").userinfo.get({
      auth: oauth2Client
    });

    const userExists = await getOneUser({
      email: data.email as string
    }, {
      id: true,
      email: true,
      monitors: true
    });

    if (!userExists) {
      await createUser({
        name: data.name as string,
        email: data.email as string,
        auth_provider: 'GOOGLE',
        email_verified: true,
        avatar: data.picture
      });
    }
    else {
      // Update the details
      await updateOneUser({
        email: userExists.email
      }, {
        avatar: data?.picture || undefined,
        name: data?.name || undefined
      });
    }

    const user = await getOneUser({
      email: data?.email as string
    }, {
      id: true,
      email: true,
      name: true,
      monitors: true,
      avatar: true
    })

    // Generate access token
    const access_token: string = generateToken({
      id: user?.id,
      email: user?.email
    });

    // Encrypt data
    const encrypted: string = encryption({
      tokens: {
        access_token
      },
      user: user
    }, 5 * 60 * 1000) // 5 minutes

    return res.redirect(`${ENV_VALUES.CLIENT_ENDPOINT}/auth/google?encrypted=${encrypted}`);
  } catch (error: any) {
    console.log("🚀 ~ googleAuthCallbackController ~ error:", error?.message || error, error?.statusCode)
    return next(
      new CustomError(
        error?.message || 'Something went wrong! please try again.',
        error?.statusCode || httpStatusCodes['Internal Server Error']
      )
    )
  }
}

export const googleAuthEncryptionController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { encrypted } = req?.query;

    if (!encrypted) return next(new BadRequestError('Encrypted text not provided'));

    const data = decryption(encrypted as string);

    return handleResponse(
      res,
      {
        message: 'Data decrypted successfully',
        data
      },
      httpStatusCodes['OK']
    );
  } catch (error: any) {
    console.log("🚀 ~ googleAuthEncryptionController ~ error:", error?.message || error, error?.statusCode)
    return next(
      new CustomError(
        error?.message || 'Something went wrong! please try again.',
        error?.statusCode || httpStatusCodes['Internal Server Error']
      )
    )
  }
}