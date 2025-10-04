import Heading from "@/components/heading"
import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"

export default function TermsAndConditions() {
    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center overflow-y-scroll py-24">
            <div className="w-3/4 lg:w-1/3">
                <Heading
                    title="Terms And Conditions"
                />
                <p><b>1. Introduction</b></p>
                <p>Welcome to shrt.om (“we”, “our”, or “us”). By accessing or using our URL shortening service (the “Service”), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website or services.</p>
                <br />

                <p><b>2. Service Description</b></p>
                <p>Our Service allows users to create free shortened URLs. Shortened URLs are randomly generated and cannot be customized. If you create a shortened URL without signing in, it will not be associated with any account and cannot be recovered once lost or deleted. Signed-in users can manage and view their previously created URLs.</p>
                <br />

                <p><b>3. User Accounts</b></p>
                <p>To access certain features, you may be required to create an account. When registering, you must provide accurate and complete information including your name, email address, and phone number. You are responsible for maintaining the confidentiality of your account credentials and all activities that occur under your account.</p>
                <br />

                <p><b>4. Collection and Use of Information</b></p>
                <p>We collect your name, email address, and phone number to provide account management, improve the Service, and communicate with you when necessary. Your information will not be sold or shared with third parties, except as required by law or to operate essential parts of the Service. For more details, please refer to our Privacy Policy.</p>
                <br />

                <p><b>5. Acceptable Use</b></p>
                <p>You agree not to use the Service for any illegal, harmful, or abusive activity. This includes distributing malware, phishing links, or spam, and violating the rights of others or any applicable law. We reserve the right to suspend or delete accounts or URLs that violate these rules.</p>
                <br />

                <p><b>6. Limitation of Liability</b></p>
                <p>We do not guarantee that the Service will be uninterrupted, secure, or error-free. We are not responsible for any damages or losses resulting from your use or inability to use the Service, including lost data or broken links.</p>
                <br />

                <p><b>7. Termination</b></p>
                <p>We may suspend or terminate your access to the Service at any time, with or without notice, for violating these Terms or for other reasons at our discretion.</p>
                <br />

                <p><b>8. Changes to Terms</b></p>
                <p>We may update these Terms and Conditions from time to time. The latest version will always be available on our website. Continued use of the Service after changes indicates your acceptance of the updated Terms.</p>
                <br />

                <div className="flex justify-end w-full gap-8">
                    <Button
                        variant="destructive" >
                        <a href="https://nahj.tech"> I Don't Agree </a>
                    </Button>
                    <Button
                        variant="default" className="flex-1"
                    >
                        <Link href="/terms/agree">
                            I Agree To Terms and Conditions
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
