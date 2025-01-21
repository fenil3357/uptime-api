import { Prisma, User } from "@prisma/client";

import { prisma } from "../../../config/Prisma/prisma.client.js";
import { hasPassword } from "../../../utils/bcrypt.js";
import { CustomError } from "../../../helper/errors/custom-errors.js";
import { httpStatusCodes } from "../../../constant/httpStatus/httpStatusCodes.constants.js";

export const createUser = async (data: Prisma.UserCreateInput): Promise<User | null> => {
  try {
    // Encode the password
    if (data.password) data.password = await hasPassword(data.password);

    return await prisma.user.create({
      data
    });

  } catch (error: any) {
    console.log("🚀 ~ createUser ~ error:", error?.message || error)
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
    console.log("🚀 ~ getOneUser ~ error:", error?.message || error)
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
    console.log("🚀 ~ deleteOneUser ~ error:", error?.message || error)
    throw new CustomError(
      error?.message || 'Something went wrong while deleting user.',
      error?.statusCode || httpStatusCodes['Internal Server Error']
    );
  }
}

export const updateOneUser = async (query: Prisma.UserWhereUniqueInput, dataToUpdate: Prisma.UserUpdateInput): Promise<User | null> => {
  try {
    return await prisma.user.update({
      data: dataToUpdate,
      where: query
    })
  } catch (error: any) {
    console.log("🚀 ~ updateUser ~ error:", error?.message || error)
    throw new CustomError(
      error?.message || 'Something went wrong while updating user.',
      error?.statusCode || httpStatusCodes['Internal Server Error']
    )
  }
}

export const updateUserMonitorCount = async (query: Prisma.UserWhereUniqueInput, count: number): Promise<User | null> => {
  try {
    let user = await prisma.user.update({
      data: {
        monitors: {
          increment: count
        }
      },
      where: query
    });

    // Set to zero if gets negative
    if (user.monitors < 0) {
      user = await prisma.user.update({
        where: query,
        data: { monitors: 0 }
      })
    }

    return user;
  } catch (error: any) {
    console.log("🚀 ~ updateUserMonitorCount ~ error:", error?.message || error)
    throw new CustomError(
      error?.message || 'Something went wrong while updating user monitor count.',
      error?.statusCode || httpStatusCodes['Internal Server Error']
    )
  }
}