package com.runora

import android.app.KeyguardManager
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class AuthModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "AuthModule"

    private val biometricManager by lazy {
        BiometricManager.from(reactApplicationContext)
    }

    private val keyguardManager by lazy {
        reactApplicationContext.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
    }

    @ReactMethod
    fun checkBiometricSupport(promise: Promise) {
        when (biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG)) {
            BiometricManager.BIOMETRIC_SUCCESS -> promise.resolve(true)
            else -> promise.resolve(false)
        }
    }

    @ReactMethod
    fun showBiometricPrompt(promise: Promise) {
        val activity = currentActivity as? FragmentActivity ?: run {
            promise.reject("NO_ACTIVITY", "No activity found")
            return
        }

        val executor = ContextCompat.getMainExecutor(activity)
        val callback = object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                super.onAuthenticationSucceeded(result)
                promise.resolve(true)
            }

            override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                super.onAuthenticationError(errorCode, errString)
                if (errorCode == BiometricPrompt.ERROR_NEGATIVE_BUTTON) {
                    showDeviceLockScreen()
                } else {
                    promise.reject("AUTH_ERROR", errString.toString())
                }
            }

            override fun onAuthenticationFailed() {
                super.onAuthenticationFailed()
                // Keep the prompt open for retry
            }
        }

        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Authenticate")
            .setSubtitle("Confirm your identity to access the app")
            .setNegativeButtonText("Use Device Password")
            .build()

        BiometricPrompt(activity, executor, callback).authenticate(promptInfo)
    }

    @ReactMethod
    fun showDeviceLockScreen() {
        val activity = currentActivity ?: return
        if (keyguardManager.isDeviceSecure) {
            val intent = keyguardManager.createConfirmDeviceCredentialIntent(
                "Authenticate",
                "Please confirm your device credentials to continue"
            )
            activity.startActivityForResult(intent, REQUEST_CODE_CONFIRM_DEVICE_CREDENTIALS)
        }
    }

    companion object {
        const val REQUEST_CODE_CONFIRM_DEVICE_CREDENTIALS = 1234
    }
}
