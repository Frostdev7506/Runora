package com.runora

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import android.view.WindowManager
import android.os.Bundle
import android.app.KeyguardManager
import android.content.Context
import android.content.Intent
import android.view.View
import android.widget.FrameLayout
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity

class MainActivity : ReactActivity() {
    private var secureView: View? = null
    private var isAuthenticated = false

    /**
     * Returns the name of the main component registered from JavaScript.
     */
    override fun getMainComponentName(): String = "Runora"

    /**
     * Returns the instance of the [ReactActivityDelegate].
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, DefaultNewArchitectureEntryPoint.fabricEnabled)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(null)
        
        // Enable secure flag and setup blank screen for recents
        window.setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE)
        setupSecureView()
        
        // Show authentication prompt immediately
        if (!isAuthenticated) {
            showAuthenticationPrompt()
        }
    }

    private fun setupSecureView() {
        secureView = FrameLayout(this).apply {
            setBackgroundColor(android.graphics.Color.WHITE)
            visibility = View.GONE
        }
        addContentView(
            secureView,
            FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        )
    }

    private fun showAuthenticationPrompt() {
        val biometricManager = BiometricManager.from(this)
        if (biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG) 
            == BiometricManager.BIOMETRIC_SUCCESS) {
            showBiometricPrompt()
        } else {
            showDeviceLockScreen()
        }
    }

    private fun showBiometricPrompt() {
        val fragmentActivity = this
        val executor = ContextCompat.getMainExecutor(this)
        val biometricPrompt = BiometricPrompt(
            fragmentActivity as FragmentActivity,
            executor,
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    super.onAuthenticationSucceeded(result)
                    isAuthenticated = true
                    secureView?.visibility = View.GONE
                }

                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    super.onAuthenticationError(errorCode, errString)
                    if (errorCode == BiometricPrompt.ERROR_NEGATIVE_BUTTON) {
                        showDeviceLockScreen()
                    }
                }
            }
        )

        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Bruh! Authenticate Your Device")
            .setSubtitle("Confirm your identity to access the app")
            .setNegativeButtonText("Use Device Password")
            .build()

        biometricPrompt.authenticate(promptInfo)
    }

    private fun showDeviceLockScreen() {
        val keyguardManager = getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
        if (keyguardManager.isDeviceSecure) {
            val intent = keyguardManager.createConfirmDeviceCredentialIntent(
                "Authenticate",
                "Please confirm your device credentials to continue"
            )
            startActivityForResult(intent, REQUEST_CODE_CONFIRM_DEVICE_CREDENTIALS)
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_CODE_CONFIRM_DEVICE_CREDENTIALS) {
            if (resultCode == RESULT_OK) {
                isAuthenticated = true
                secureView?.visibility = View.GONE
            } else {
                // Authentication failed, finish the activity
                finish()
            }
        }
    }

    override fun onPause() {
        super.onPause()
        isAuthenticated = false
        secureView?.visibility = View.VISIBLE
    }

    override fun onResume() {
        super.onResume()
        window.setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE)
        if (!isAuthenticated) {
            showAuthenticationPrompt()
        } else {
            secureView?.visibility = View.GONE
        }
    }

    override fun onStop() {
        super.onStop()
        isAuthenticated = false
        secureView?.visibility = View.VISIBLE
    }

    companion object {
        private const val REQUEST_CODE_CONFIRM_DEVICE_CREDENTIALS = 1234
    }
}