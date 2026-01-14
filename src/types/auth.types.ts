// Data sent when registering a new user

export interface RegisterInput {
  email: string;
  password: string;
}

// Data sent when logging in an existing user
export interface LoginInput {
  email: string;
  password: string;
}

// Shape of a user stored in the database
export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

// Data stored inside the JWT
export interface JwtPayload {
  userId: string;
  email: string;
}
