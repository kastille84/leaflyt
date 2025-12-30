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

export default function CommunityGuidelines() {
  return (
    <StyledMain>
      <h1>LEAFLIT COMMUNITY GUIDELINES</h1>

      <p>
        Welcome to the Leaflit neighborhood! Our goal is to foster a helpful,
        vibrant, and safe digital space that mirrors the best parts of a
        physical community. To keep our virtual boards useful for everyone, we
        require all users to follow these guidelines.
      </p>

      <h2>1. Be a Good Neighbor</h2>
      <ul>
        <li>
          <strong>Respect Local Spaces:</strong> Remember that while our boards
          are virtual, they are anchored to real-world locations. Do not use
          Leaflit to encourage trespassing, loitering, or any activity that
          disrupts the peace of the physical establishment nearby.
        </li>
        <li>
          <strong>Keep it Civil:</strong> Community boards are for everyone.
          Avoid hate speech, harassment, or content that attacks individuals or
          groups based on race, religion, gender, or disability.
        </li>
      </ul>

      <h2>2. Flyer Content Standards</h2>
      <p>To maintain a high-quality experience, flyers should be:</p>
      <ul>
        <li>
          <strong>Legible and Clear:</strong> Use high-quality images and
          videos. Blurry, unreadable, or intentionally confusing content may be
          removed.
        </li>
        <li>
          <strong>Honest:</strong> If you are offering a deal or a service, be
          truthful. "Bait-and-switch" tactics or fraudulent offers will result
          in a permanent ban.
        </li>
        <li>
          <strong>Appropriate:</strong> No "NSFW" (Not Safe For Work) content.
          This includes nudity, graphic violence, or highly suggestive imagery.
          Think of Leaflit as a family-friendly public square.
        </li>
      </ul>

      <h2>3. No Digital Littering (Spam)</h2>
      <p>Help us keep the boards clean:</p>
      <ul>
        <li>
          <strong>Duplicate Posting:</strong> Do not "carpet bomb" a single area
          with multiple copies of the same flyer. Stick to one flyer per board
          for the same offer or topic.
        </li>
        <li>
          <strong>Irrelevant Content:</strong> Only post flyers that are
          relevant to the community. Random memes, personal rants, or content
          with no community value may be flagged as spam.
        </li>
      </ul>

      <h2>4. Safety First</h2>
      <ul>
        <li>
          <strong>No Doxing:</strong> Do not post private information (phone
          numbers, home addresses, or private photos) of other people without
          their explicit consent.
        </li>
        <li>
          <strong>Physical Meetups:</strong> If a flyer leads to an in-person
          exchange of goods (such as a marketplace item), we strongly recommend
          meeting in well-lit, public "Safe Exchange Zones" or local police
          station lobbies.
        </li>
      </ul>

      <h2>5. Intellectual Property</h2>
      <p>
        Only post what you own. Do not use copyrighted photos, logos, or videos
        in your flyers unless you have the legal right to do so. If we receive a
        valid DMCA (Digital Millennium Copyright Act) notice, your flyer will be
        removed immediately.
      </p>

      <h2>6. Reporting Violations</h2>
      <p>
        The strength of Leaflit lies in its community. If you see a flyer that
        violates these rules:
      </p>
      <ol>
        <li>Use the "Report" button on the flyer.</li>
        <li>Provide a brief reason for the report.</li>
        <li>
          Our moderation team will review the content and take action, ranging
          from a warning to account termination.
        </li>
      </ol>

      <h2>How We Enforce These Rules</h2>
      <p>
        Leaflit uses a combination of automated filters and human review. We
        reserve the right to remove any content or suspend any account that we
        feel undermines the safety or integrity of the Leaflit community, even
        if the specific behavior is not explicitly listed above.
      </p>
    </StyledMain>
  );
}
