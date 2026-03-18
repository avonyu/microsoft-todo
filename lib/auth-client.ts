import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});

export const { signOut, useSession } = authClient;

// Email/Password Sign In
export const signInEmail = async (email: string, password: string, rememberMe?: boolean) => {
  const { data, error } = await authClient.signIn.email({
    email,
    password,
    rememberMe,
  });
  return { data, error };
};

// Email/Password Sign Up
export const signUpEmail = async (
  name: string,
  email: string,
  password: string
) => {
  const { data, error } = await authClient.signUp.email({
    name,
    email,
    password,
  });
  return { data, error };
};

// OAuth Sign In
export const signInGithub = async () => {
  const data = await authClient.signIn.social({
    provider: "github",
  });
  return data;
};

export const signInGoogle = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
  return data;
};
