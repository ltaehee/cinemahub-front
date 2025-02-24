import { z } from "zod";

export const profileSchema = z.object({
  nickname: z
    .string()
    .min(2, { message: "닉네임은 최소 2글자 이상이어야 합니다." })
    .max(10, { message: "닉네임은 최대 10글자까지 가능합니다." }),

  introduce: z
    .string()
    .max(50, { message: "자기소개는 최대 50글자까지 가능합니다." })
    .optional(),
});
