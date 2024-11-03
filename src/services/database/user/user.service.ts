import { PrismaClient, Prisma, User } from "@prisma/client";

import { hasPassword } from "../../../utils/encryption";
import { CustomError } from "../../../helper/errors/custom-errors";
import { httpStatusCodes } from "../../../constant/httpStatus/httpStatusCodes.constants";

const prisma = new PrismaClient();

export const createUser = async (data: Prisma.UserCreateInput): Promise<User | null> => {
  try {
    // Encode the password
    if (data.password) data.password = await hasPassword(data.password);

    return await prisma.user.create({
      data
    });

  } catch (error: any) {
    console.log("🚀 ~ createUser ~ error:", error)
    throw new CustomError(
      error?.message || 'Something went wrong while creating a new user.',
      error?.statusCode || httpStatusCodes['Internal Server Error']
    );
  }
}

export const getOneUser = async (query: Prisma.UserWhereInput, projection?: Prisma.UserSelect): Promise<User | null> => {
  try {
    return await prisma.user.findFirst({
      where: query,
      select: projection || undefined
    });
  } catch (error: any) {
    console.log("🚀 ~ getOneUser ~ error:", error)
    throw new CustomError(
      error?.message || 'Something went wrong while fetching one user.',
      error?.statusCode || httpStatusCodes['Internal Server Error']
    );
  }
}

export const deleteOneUser = async (query: Prisma.UserWhereUniqueInput): Promise<User | null> => {
  try {
    return await prisma.user.delete({
      where: query
    })
  } catch (error: any) {
    console.log("🚀 ~ deleteOneUser ~ error:", error)
    throw new CustomError(
      error?.message || 'Something went wrong while deleting user.',
      error?.statusCode || httpStatusCodes['Internal Server Error']
    );
  }
}