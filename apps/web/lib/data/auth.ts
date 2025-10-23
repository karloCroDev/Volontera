// External pakcages
import { API } from '@/config/axios-client';

// Schemas
import {
	ForgotPasswordArgs,
	LoginArgs,
	RegisterArgs,
	ResetPasswordArgs,
	VerifyEmailArgs,
} from '@repo/schemas/auth';

// Lib
import { catchError } from '@/lib/utils/error';

// Getting the user
export async function clientSession() {
	try {
		const res = await API().get('auth/session');
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

// Authentication (basics)
export async function login(data: LoginArgs) {
	try {
		const res = await API().post('auth/login', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function register(data: RegisterArgs) {
	try {
		const res = await API().post('auth/register', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function logout() {
	try {
		const res = await API().post('auth/logout');
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

// Reseting password
export async function forgotPassword(data: ForgotPasswordArgs) {
	try {
		const res = await API().post('auth/forgot-password', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function resetPassword(data: ResetPasswordArgs) {
	try {
		const res = await API().post('auth/reset-password', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

// Email verification
export async function verifyEmail(data: VerifyEmailArgs) {
	try {
		const res = await API().post('auth/verify-token-otp', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function resendEmail(data: VerifyEmailArgs) {
	try {
		const res = await API().post('auth/reset-verify-token', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
