import z from "zod";

export const onlyNumbersRegex = /^(?:\d+(?:\.\d+)?|\.\d+)$/
export const positiveNumberRegex = /^(?:\d+(?:\.\d+)?|\.\d+)$/;

export const numberValidation = z.string().regex(onlyNumbersRegex, 'Must Be A Valid Number.')
export const positiveNumberValidation = z.string().regex(positiveNumberRegex, 'Must Be A Positive Number.')