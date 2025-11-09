// 🟢 DEPENDENCY INJECTION: Aquí se conectan todas las piezas
// Este es el único lugar que conoce las implementaciones concretas

import { FirebaseAuthDataSource } from "../data/datasource/FirebaseAuthDataSource";
import { AuthRepositoryImpl } from "../data/repositories/AuthRepositoryImpl";
import { AuthRepository } from "../domain/repositories/AuthRepository";
import { LoginUser } from "../domain/usecases/LoginUser";
import { RegisterUser } from "../domain/usecases/RegisterUser";
import { LogoutUser } from "../domain/usecases/LogoutUser";
import { GetCurrentUser } from "../domain/usecases/GetCurrentUser";
import { UpdateProfile } from "../domain/usecases/UpdateProfile";
import { SendPasswordResetEmail } from "../domain/usecases/SendPasswordResetEmail";

// 🟢 Singleton para mantener una sola instancia
class DIContainer {
  private static instance: DIContainer;

  private _authDataSource?: FirebaseAuthDataSource;
  private _authRepository?: AuthRepository;
  private _registerUser?: RegisterUser;
  private _loginUser?: LoginUser;
  private _logoutUser?: LogoutUser;
  private _getCurrentUser?: GetCurrentUser;
  private _updateProfile?: UpdateProfile;
  private _sendPasswordResetEmail?: SendPasswordResetEmail;

  private constructor() {}

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }

    return DIContainer.instance;
  }

  async initialize(): Promise<void> {
    this._authDataSource = new FirebaseAuthDataSource();

    await this._authDataSource.initialize();

    this._authRepository = new AuthRepositoryImpl(this._authDataSource);
  }

  // ===== AUTH GETTERS =====
  get authDataSource(): FirebaseAuthDataSource {
    if (!this._authDataSource) {
      this._authDataSource = new FirebaseAuthDataSource();
    }
    return this._authDataSource;
  }

  get authRepository(): AuthRepository {
    if (!this._authRepository) {
      this._authRepository = new AuthRepositoryImpl(this.authDataSource);
    }
    return this._authRepository;
  }

  get registerUser(): RegisterUser {
    if (!this._registerUser) {
      this._registerUser = new RegisterUser(this.authRepository);
    }
    return this._registerUser;
  }

  get loginUser(): LoginUser {
    if (!this._loginUser) {
      this._loginUser = new LoginUser(this.authRepository);
    }
    return this._loginUser;
  }

  get logoutUser(): LogoutUser {
    if (!this._logoutUser) {
      this._logoutUser = new LogoutUser(this.authRepository);
    }
    return this._logoutUser;
  }

  get getCurrentUser(): GetCurrentUser {
    if (!this._getCurrentUser) {
      this._getCurrentUser = new GetCurrentUser(this.authRepository);
    }
    return this._getCurrentUser;
  }

  get updateProfile(): UpdateProfile {
    if (!this._updateProfile) {
      this._updateProfile = new UpdateProfile(this.authRepository);
    }
    return this._updateProfile;
  }

  get sendPasswordResetEmail(): SendPasswordResetEmail {
    if (!this._sendPasswordResetEmail) {
      this._sendPasswordResetEmail = new SendPasswordResetEmail(
        this.authRepository
      );
    }
    return this._sendPasswordResetEmail;
  }
}

export const container = DIContainer.getInstance();
