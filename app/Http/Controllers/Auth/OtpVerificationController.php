<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OtpVerificationController extends Controller
{
    /**
     * Show the OTP verification page.
     */
    public function show(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route('dashboard');
        }

        return inertia('auth/verify-otp', [
            'status' => session('status'),
        ]);
    }

    /**
     * Verify the OTP code.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'otp' => ['required', 'string', 'size:6'],
        ]);

        $user = $request->user();

        // Check if OTP matches and hasn't expired
        if ($user->otp !== $request->otp) {
            return back()->withErrors(['otp' => 'The OTP code is incorrect.']);
        }

        if ($user->otp_expires_at < now()) {
            return back()->withErrors(['otp' => 'The OTP code has expired. Please request a new one.']);
        }

        // Mark email as verified
        $user->email_verified_at = now();
        $user->otp = null;
        $user->otp_expires_at = null;
        $user->save();

        return redirect()->route('dashboard')->with('status', 'Email verified successfully!');
    }

    /**
     * Resend the OTP code.
     */
    public function resend(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('dashboard');
        }

        // Generate new OTP
        $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        $user->otp = $otp;
        $user->otp_expires_at = now()->addMinutes(10);
        $user->save();

        // Send OTP email
        \Mail::to($user->email)->send(new \App\Mail\OtpMail($otp));

        return back()->with('status', 'A new OTP code has been sent to your email.');
    }
}
