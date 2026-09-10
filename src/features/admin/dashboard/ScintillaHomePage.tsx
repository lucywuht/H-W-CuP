import { Image } from '../../../components/Image';
import {
  Button as LDButton,
  LDIcon,
  LinkButton,
} from '@walmart-dataventures/shared-components';
import defaultInstanceIllustration from '../../../assets/illustrations/default instance.svg';
import supportIllustration from '../../../assets/illustrations/Illustration.svg';
import gameControllerIllustration from '../../../assets/illustrations/GameController.svg';
import noSearchResultsIllustration from '../../../assets/illustrations/No Search Results.svg';
import homeImprovementIllustration from '../../../assets/illustrations/HomeImprovement.svg';
import mailboxOpenRectangleIllustration from '../../../assets/illustrations/Mailbox_Open_Rectangle.svg';
import opdDataIllustration from '../../../assets/illustrations/Image.svg';
import makingTheGradeIllustration from '../../../assets/illustrations/Image1.svg';
import biLinkIllustration from '../../../assets/illustrations/Image2.svg';

export function ScintillaHomePage() {
  const supportCards: Array<{
    title: string;
    description: string;
    cta: string;
    illustrationSrc: string;
    externalLink?: boolean;
  }> = [
    {
      title: 'Knowledge Base',
      description: 'Explore helpful docs for our entire product suite.',
      cta: 'Start here',
      illustrationSrc: supportIllustration,
    },
    {
      title: 'Scintilla Learn',
      description: 'Access self-guided courses and earn certifications.',
      cta: 'Explore courses',
      illustrationSrc: gameControllerIllustration,
      externalLink: true,
    },
    {
      title: 'Data Dictionary',
      description: 'Find definitions for common Scintilla terms.',
      cta: 'Look it up',
      illustrationSrc: noSearchResultsIllustration,
    },
    {
      title: 'Support Requests',
      description: 'Submit or check the status of a help ticket.',
      cta: 'Contact us',
      illustrationSrc: homeImprovementIllustration,
    },
    {
      title: 'Release Notes',
      description: "Discover what's new and improved in Scintilla.",
      cta: 'Learn more',
      illustrationSrc: mailboxOpenRectangleIllustration,
    },
  ];

  const discoverCards: Array<{
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  }> = [
    {
      title: 'Unlocking the Power of OPD Data',
      description:
        'Scintilla charter clients are getting access to OPD sales and operations data for the very first time. But what, exactly, can you do with it?',
      image: opdDataIllustration,
      imageAlt: 'Retail aisle and in-store shopping scenario',
    },
    {
      title: 'Making the Grade',
      description:
        'Coming out of Back-To-School, Halloween, Holiday, or any other selling event, Scintilla provides you with new insights to help you more deeply understand your customers as you look ahead and plan for next year.',
      image: makingTheGradeIllustration,
      imageAlt: 'Smiling family with school-aged children',
    },
    {
      title: 'Data, Your Way With BI Link',
      description:
        'Charter suppliers can now easily access our growing ecosystem with BI Link to quickly build custom BI dashboards using our API data.',
      image: biLinkIllustration,
      imageAlt: 'Dashboard analytics and shopping cart visual',
    },
  ];

  return (
    <div
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <section
        aria-label="Welcome banner"
        style={{
          backgroundColor: 'var(--ld-semantic-color-fill-brand-bold, #13014A)',
          borderRadius: 'var(--ld-primitive-scale-borderradius-100, 8px)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 594px) minmax(0, 1fr)',
          minHeight: 188,
        }}
      >
        <div
          style={{
            padding: '40px 56px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 42,
              lineHeight: '52px',
              fontWeight: 700,
              fontFamily:
                "var(--ld-semantic-font-display-large-family, var(--ld-primitive-font-family-sans, 'Everyday Sans UI', -apple-system, Roboto, sans-serif))",
              color: 'var(--ld-semantic-color-text-inverse, #ffffff)',
            }}
          >
            Welcome to Scintilla!
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 16,
              lineHeight: '24px',
              fontWeight: 400,
              fontFamily:
                "var(--ld-semantic-font-body-medium-family, var(--ld-primitive-font-family-sans, 'Everyday Sans UI', -apple-system, Roboto, sans-serif))",
              color: 'var(--ld-semantic-color-text-inverse, #ffffff)',
            }}
          >
            Optimize operations, uncover insights, and seize growth
            opportunities.
          </p>
        </div>

        <div
          style={{ position: 'relative', minHeight: 188, overflow: 'hidden' }}
        >
          <Image
            src={defaultInstanceIllustration}
            alt="Illustration representing Scintilla onboarding"
            UNSAFE_style={{
              position: 'absolute',
              right: -150,
              top: -20,
              width: 650,
              height: 455,
              objectFit: 'contain',
            }}
          />
        </div>
      </section>

      <section aria-labelledby="home-support-heading">
        <h2
          id="home-support-heading"
          style={{
            margin: 0,
            fontSize: 24,
            lineHeight: '36px',
            fontWeight: 700,
            fontFamily:
              "var(--ld-semantic-font-heading-large-family, var(--ld-primitive-font-family-sans, 'Everyday Sans UI', -apple-system, Roboto, sans-serif))",
            color: 'var(--ld-semantic-color-text, #2e2f32)',
          }}
        >
          Learn and get support
        </h2>
        <div
          style={{
            marginTop: 16,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
          }}
        >
          {supportCards.map((card) => (
            <article
              key={card.title}
              style={{
                backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
                border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
                borderRadius: 'var(--ld-primitive-scale-borderradius-100, 8px)',
                padding: '20px 16px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: 236,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--ld-semantic-color-text-brand, #6245b7)',
                }}
              >
                {card.illustrationSrc ? (
                  <Image
                    src={card.illustrationSrc}
                    alt={`${card.title} illustration`}
                    UNSAFE_style={{
                      width: 80,
                      height: 80,
                      objectFit: 'contain',
                    }}
                  />
                ) : null}
              </div>
              <h3
                style={{
                  margin: '4px 0 0 0',
                  fontSize: 18,
                  lineHeight: '24px',
                  fontWeight: 700,
                  fontFamily:
                    "var(--ld-semantic-font-heading-medium-family, var(--ld-primitive-font-family-sans, 'Everyday Sans UI', -apple-system, Roboto, sans-serif))",
                  color: 'var(--ld-semantic-color-text, #2e2f32)',
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  margin: '4px 0 0 0',
                  fontSize: 12,
                  lineHeight: '16px',
                  fontWeight: 400,
                  fontFamily:
                    "var(--ld-semantic-font-body-small-family, var(--ld-primitive-font-family-sans, 'Everyday Sans UI', -apple-system, Roboto, sans-serif))",
                  color: 'var(--ld-semantic-color-text-subtle, #74767c)',
                }}
              >
                {card.description}
              </p>
              <div style={{ marginTop: 'auto', paddingTop: 12 }}>
                <LDButton
                  size="small"
                  variant="secondary"
                  trailing={
                    card.externalLink ? (
                      <LDIcon.LinkExternal size="small" aria-hidden />
                    ) : undefined
                  }
                  onClick={() => undefined}
                >
                  {card.cta}
                </LDButton>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="home-discover-heading">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <h2
            id="home-discover-heading"
            style={{
              margin: 0,
              fontSize: 24,
              lineHeight: '36px',
              fontWeight: 700,
              fontFamily:
                "var(--ld-semantic-font-heading-large-family, var(--ld-primitive-font-family-sans, 'Everyday Sans UI', -apple-system, Roboto, sans-serif))",
              color: 'var(--ld-semantic-color-text, #2e2f32)',
            }}
          >
            Discover something new
          </h2>
          <LinkButton
            color="default"
            size="small"
            trailing={<LDIcon.LinkExternal size="small" aria-hidden />}
            onClick={() => undefined}
          >
            View All
          </LinkButton>
        </div>

        <div
          style={{
            marginTop: 16,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {discoverCards.map((card) => (
            <article
              key={card.title}
              style={{
                backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
                border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
                borderRadius: 'var(--ld-primitive-scale-borderradius-100, 8px)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Image
                src={card.image}
                alt={card.imageAlt}
                UNSAFE_style={{
                  width: '100%',
                  height: 128,
                  objectFit: 'cover',
                }}
              />
              <div
                style={{
                  padding: '16px 24px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 24,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      lineHeight: '24px',
                      fontWeight: 700,
                      fontFamily:
                        "var(--ld-semantic-font-heading-medium-family, var(--ld-primitive-font-family-sans, 'Everyday Sans UI', -apple-system, Roboto, sans-serif))",
                      color: 'var(--ld-semantic-color-text, #2e2f32)',
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      lineHeight: '16px',
                      fontWeight: 400,
                      fontFamily:
                        "var(--ld-semantic-font-body-small-family, var(--ld-primitive-font-family-sans, 'Everyday Sans UI', -apple-system, Roboto, sans-serif))",
                      color: 'var(--ld-semantic-color-text-subtle, #74767c)',
                    }}
                  >
                    {card.description}
                  </p>
                </div>
                <div>
                  <LDButton
                    size="small"
                    variant="secondary"
                    trailing={<LDIcon.LinkExternal size="small" aria-hidden />}
                    onClick={() => undefined}
                  >
                    Read more
                  </LDButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
