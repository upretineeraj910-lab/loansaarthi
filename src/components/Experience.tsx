import Image from "next/image";
import "./WhyChooseUs.css";

export default function WhyChooseUs() {
  return (
    <section className="why-choose-section">
      <div className="why-choose-container">

        {/* LEFT CONTENT */}
        <div className="why-choose-content">

          <span className="why-choose-label">
            WHY CHOOSE US
          </span>

          <h2>
            25+ Years of Experience in
            <br />
            Finance Solutions
            <br />
            Management
          </h2>

          <p className="why-choose-description">
            With LoanSaarthi by your side, you can trust in our expertise
            and professionalism to handle all your loan requirements.
          </p>

          {/* FEATURE 1 */}
          <div className="why-feature">
            <div className="why-feature-icon">
              <Image
                src="/images/icons/fast-loan.png"
                alt="Fast loan disbursal"
                width={58}
                height={58}
              />
            </div>

            <div className="why-feature-content">
              <h3>Fast Disbursal</h3>

              <p>
                We ensure that your application is processed in the lowest
                turnaround time &amp; you get the fastest disbursal.
              </p>
            </div>
          </div>

          {/* FEATURE 2 */}
          <div className="why-feature">
            <div className="why-feature-icon">
              <Image
                src="/images/icons/safe-secure.png"
                alt="Safe and secure loan process"
                width={58}
                height={58}
              />
            </div>

            <div className="why-feature-content">
              <h3>Safe &amp; Secure</h3>

              <p>
                Every applicant is guaranteed total data confidentiality
                and privacy by our systems.
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="why-choose-image">
          <Image
            src="/images/icons/experienceLoanSaarthi.png"
            alt="LoanSaarthi finance solutions"
            width={650}
            height={520}
            priority
          />
        </div>

      </div>
    </section>
  );
}