import styled from "styled-components";

const StyledMain = styled.main`
  padding: 2.4rem;

  & h1,
  & h2,
  & h3 {
    margin-top: 1.4rem;
    color: var(--color-brand-600);
  }
  & strong {
    color: var(--color-orange-600);
  }
`;

export default function TermsOfUse() {
  return (
    <StyledMain>
      <h1>TERMS OF USE FOR LEAFLIT</h1>

      <p>
        <strong>Effective Date:</strong> December 30, 2025
      </p>

      <p>
        These Terms of Use ("Terms") constitute a legally binding agreement
        between Leaflit ("we," "us," or "our") and you ("User," "you," or
        "your"). By accessing or using the Leaflit application and website (the
        "Service"), you agree to be bound by these Terms.
      </p>

      <h2>1. Description of Service</h2>
      <p>
        Leaflit provides a virtual flyer distribution platform using
        geo-location technology. Users may create, upload, and view virtual
        flyers on "Virtual Community Boards" located near physical
        establishments.
      </p>
      <p>
        <strong>IMPORTANT:</strong> Leaflit is an independent platform. Our
        Virtual Community Boards are digital overlays and have no legal or
        commercial association with the physical establishments, property
        owners, or businesses located at or near the geo-coordinates where
        flyers appear.
      </p>

      <h2>2. Eligibility and Account Security</h2>
      <ul>
        <li>
          <strong>Age:</strong> You must be at least 18 years old to create an
          account.
        </li>
        <li>
          <strong>Accuracy:</strong> You agree to provide accurate information
          and maintain the security of your credentials.
        </li>
        <li>
          <strong>Responsibility:</strong> You are solely responsible for all
          activity occurring under your account.
        </li>
      </ul>

      <h2>3. User-Generated Content (UGC)</h2>
      <p>
        You retain ownership of the images, videos, and text you upload.
        However, by posting content to Leaflit, you grant us a worldwide,
        non-exclusive, royalty-free, sublicensable license to host, store, use,
        display, reproduce, and distribute that content.
      </p>

      <h3>Acceptable Behavior &amp; Content Restrictions</h3>
      <p>You agree not to post content that:</p>
      <ul>
        <li>Is defamatory, obscene, pornographic, or promotes illegal acts.</li>
        <li>
          Infringes on any third-party intellectual property or privacy rights.
        </li>
        <li>
          Contains "spam" or deceptive marketing (e.g., bait-and-switch offers).
        </li>
        <li>
          Harasses or stalks other users through the geo-location features.
        </li>
      </ul>

      <h2>4. Interactions and Transactions</h2>
      <p>Leaflit facilitates the display of offers and deals. However:</p>
      <ul>
        <li>
          <strong>No Agency:</strong> Leaflit is not a party to any exchange of
          goods or services between users.
        </li>
        <li>
          <strong>No Guarantee:</strong> We do not verify the legitimacy of
          offers, the quality of services, or the identity of users.
        </li>
        <li>
          <strong>Risk:</strong> Any interaction, whether digital or in-person,
          resulting from a flyer on Leaflit is at your own risk.
        </li>
      </ul>

      <h2>5. Geo-Location and Physical Safety</h2>
      <p>Leaflit relies on GPS data. You acknowledge that:</p>
      <ol>
        <li>
          <strong>Accuracy:</strong> GPS data may be inaccurate or subject to
          "drift."
        </li>
        <li>
          <strong>Property Rights:</strong> Users must obey all local laws and
          trespassing statutes. The existence of a virtual board "near" a
          business does not grant you the right to enter that business or loiter
          on their premises.
        </li>
        <li>
          <strong>Safety:</strong> Always be aware of your surroundings. Do not
          use the Service while driving or in a manner that endangers yourself
          or others.
        </li>
      </ol>

      <h2>6. Limitation of Liability</h2>
      <p>
        <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW,</strong> Leaflit and its
        owners shall not be liable for any indirect, incidental, special, or
        consequential damages, including but not limited to:
      </p>
      <ul>
        <li>Loss of profits or data.</li>
        <li>
          Personal injury or property damage resulting from your use of the
          Service.
        </li>
        <li>
          The conduct of any third party (including physical establishments) or
          other users.
        </li>
        <li>Any unauthorized access to your content.</li>
      </ul>

      <h2>7. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless Leaflit and its officers from
        any claims, damages, or legal fees arising from: (i) your violation of
        these Terms; (ii) your User Content; or (iii) your physical actions at
        or near any geo-location associated with the Service.
      </p>

      <h2>8. Termination</h2>
      <p>
        We reserve the right to suspend or terminate your account at our sole
        discretion, without notice, for conduct that we believe violates these
        Terms or is harmful to other users, us, or third parties.
      </p>

      <h2>9. Changes to Terms</h2>
      <p>
        We may modify these Terms at any time. Continued use of the Service
        after changes are posted constitutes your acceptance of the new Terms.
      </p>

      <h2>10. Governing Law</h2>
      <p>
        These Terms are governed by the laws of
        <em>New York State</em>, without regard to conflict of law principles.
      </p>
    </StyledMain>
  );
}
