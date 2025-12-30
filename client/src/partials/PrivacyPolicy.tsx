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

export default function PrivacyPolicy() {
  return (
    <StyledMain>
      <h1>PRIVACY POLICY FOR LEAFLIT</h1>

      <p>
        <strong>Effective Date:</strong> December 30, 2025
      </p>

      <p>
        At Leaflit, we respect your privacy and are committed to protecting your
        personal data. This Privacy Policy explains how we collect, use, and
        safeguard your information when you use our mobile application and
        website.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        To provide a location-based experience, we collect the following types
        of information:
      </p>
      <ul>
        <li>
          <strong>Account Information:</strong> Your name, email address, and
          profile picture provided during registration.
        </li>
        <li>
          <strong>Geo-location Data:</strong> With your consent, we collect
          precise GPS coordinates to show you virtual boards in your immediate
          vicinity. This is the core functionality of the Service.
        </li>
        <li>
          <strong>User-Generated Content:</strong> Any text, images, or videos
          you upload to your virtual flyers.
        </li>
        <li>
          <strong>Usage Data:</strong> Information about how you interact with
          the app, such as which flyers you "like," save, or click on.
        </li>
        <li>
          <strong>Device Information:</strong> IP address, device type, and
          operating system version.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use your data to:</p>
      <ul>
        <li>Identify virtual community boards near your current location.</li>
        <li>
          Display your flyers to other users within the relevant geographic
          radius.
        </li>
        <li>Facilitate "likes" and "saves" for community engagement.</li>
        <li>Improve app performance and detect fraudulent activity.</li>
        <li>
          Communicate with you regarding account updates or security alerts.
        </li>
      </ul>

      <h2>3. Sharing of Information</h2>
      <p>
        We do not sell your personal data to third parties. We may share
        information only in the following circumstances:
      </p>
      <ul>
        <li>
          <strong>Public Display:</strong> Flyers, including the media and text
          you upload, are visible to any user near that geo-location.
        </li>
        <li>
          <strong>Service Providers:</strong> We may use third-party hosting or
          map service providers (e.g., Google Maps API) to power the app.
        </li>
        <li>
          <strong>Legal Necessity:</strong> If required by law, subpoena, or to
          protect the safety of our users or the public.
        </li>
      </ul>

      <h2>4. Location Permissions &amp; Tracking</h2>
      <ul>
        <li>
          <strong>Real-Time Tracking:</strong> Leaflit collects location data
          while the app is in use to populate the "Virtual Community Boards."
        </li>
        <li>
          <strong>Background Location:</strong> If you grant permission, we may
          access location data in the background to notify you of nearby flyers.
          You can opt out of this in your device settings at any time.
        </li>
        <li>
          <strong>De-identification:</strong> We may use aggregated,
          non-identifiable location data for analytical purposes (e.g.,
          determining which neighborhoods are most active).
        </li>
      </ul>

      <h2>5. Data Retention</h2>
      <ul>
        <li>
          <strong>Flyers:</strong> We host your flyers as long as your account
          is active or until you delete them.
        </li>
        <li>
          <strong>Location History:</strong> We do not maintain a permanent
          historical log of your precise movements. Location data is typically
          used in the moment to provide the Service and is overwritten or
          deleted regularly.
        </li>
      </ul>

      <h2>6. Your Rights and Choices</h2>
      <p>Depending on your jurisdiction, you may have the right to:</p>
      <ul>
        <li>
          <strong>Access:</strong> Request a copy of the personal data we hold
          about you.
        </li>
        <li>
          <strong>Deletion:</strong> Request that we delete your account and
          associated flyers.
        </li>
        <li>
          <strong>Correction:</strong> Update inaccurate account information.
        </li>
        <li>
          <strong>Withdraw Consent:</strong> Disable location services via your
          mobile device settings (Note: This will render the Service
          non-functional).
        </li>
      </ul>

      <h2>7. Security</h2>
      <p>
        We implement industry-standard security measures to protect your data.
        However, please be aware that no electronic transmission over the
        internet or GPS network is 100% secure.
      </p>

      <h2>8. Children’s Privacy</h2>
      <p>
        Leaflit is not intended for children under the age of 13. We do not
        knowingly collect personal information from children. If we discover
        such data has been collected, it will be deleted immediately.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us at:
        <em>leaflit.flyers@gmail.com</em>.
      </p>
    </StyledMain>
  );
}
