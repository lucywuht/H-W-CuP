import * as React from 'react';

import {
  Button as LDButton,
  LDIcon,
  MenuSingleSelect,
  PageHeader,
  Tag,
} from '@walmart-dataventures/shared-components';

import { customerPerceptionBudgetMockData } from '../../customer-perception/budget/mockData';

type ProfilePageProps = {
  onNavigateToAdmin: () => void;
  onNavigateToUserManagement: () => void;
  onSaveProfile: (fullName: string) => void;
  userName: string;
  userEmail: string;
};

type CostCenterOption = {
  id: string;
  name: string;
};

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

const INITIAL_PROFILE_FORM_VALUES: ProfileFormValues = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@hotmail.com',
};

function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmedName = fullName.trim();
  if (!trimmedName) {
    return { firstName: 'John', lastName: 'Doe' };
  }

  const [firstName = 'John', ...rest] = trimmedName.split(/\s+/);
  const lastName = rest.join(' ') || 'Doe';
  return { firstName, lastName };
}

function getCostCenterOptions(): CostCenterOption[] {
  const deduped = new Map<string, CostCenterOption>();

  Object.values(
    customerPerceptionBudgetMockData.overviewByContractYear,
  ).forEach((overview) => {
    overview.costCenters.forEach((costCenter) => {
      if (!deduped.has(costCenter.id)) {
        deduped.set(costCenter.id, {
          id: costCenter.id,
          name: costCenter.name,
        });
      }
    });
  });

  return Array.from(deduped.values());
}

export function ProfilePage({
  onNavigateToAdmin,
  onNavigateToUserManagement,
  onSaveProfile,
  userName,
  userEmail,
}: ProfilePageProps) {
  const parsedName = React.useMemo(() => splitName(userName), [userName]);
  const costCenterOptions = React.useMemo(() => getCostCenterOptions(), []);
  const menuCostCenterOptions = React.useMemo(
    () =>
      costCenterOptions.map((option) => ({
        id: option.id,
        label: option.name,
      })),
    [costCenterOptions],
  );
  const [formValues, setFormValues] = React.useState<ProfileFormValues>(() => ({
    ...INITIAL_PROFILE_FORM_VALUES,
    firstName: parsedName.firstName,
    lastName: parsedName.lastName,
    email: userEmail,
  }));
  const [selectedCostCenterId, setSelectedCostCenterId] = React.useState<
    string | undefined
  >();

  React.useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      email: userEmail,
    }));
  }, [userEmail]);

  const initialProfileValues = React.useMemo(
    () => ({
      ...INITIAL_PROFILE_FORM_VALUES,
      firstName: parsedName.firstName,
      lastName: parsedName.lastName,
      email: userEmail,
    }),
    [parsedName.firstName, parsedName.lastName, userEmail],
  );

  const isProfileDirty = React.useMemo(
    () =>
      formValues.firstName !== initialProfileValues.firstName ||
      formValues.lastName !== initialProfileValues.lastName ||
      formValues.email !== initialProfileValues.email ||
      !!selectedCostCenterId,
    [formValues, initialProfileValues, selectedCostCenterId],
  );

  const initials = React.useMemo(() => {
    const firstInitial = formValues.firstName.trim().charAt(0).toUpperCase();
    const lastInitial = formValues.lastName.trim().charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`.trim() || 'JD';
  }, [formValues.firstName, formValues.lastName]);

  return (
    <>
      <div
        style={{
          backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
        }}
      >
        <PageHeader
          breadcrumb={[
            {
              label: 'Admin',
              href: '#',
              onClick: (event) => {
                event.preventDefault();
                onNavigateToAdmin();
              },
            },
            {
              label: 'User management',
              href: '#',
              onClick: (event) => {
                event.preventDefault();
                onNavigateToUserManagement();
              },
            },
            {
              label: 'User details',
              href: '#',
              isCurrent: true,
            },
          ]}
          description="Shows the user details and access to the tools"
          keyCTAsButtonGroup={[
            <LDButton
              key="update-profile"
              variant="primary"
              size="small"
              disabled={!isProfileDirty}
              onClick={() => {
                const fullName =
                  `${formValues.firstName.trim()} ${formValues.lastName.trim()}`.trim();
                onSaveProfile(fullName || userName || 'John Doe');
              }}
              leading={<LDIcon.Check size="small" aria-hidden />}
            >
              Update profile
            </LDButton>,
          ]}
        >
          {userName}
        </PageHeader>
      </div>

      <div
        style={{
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 800,
            backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
            border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            borderRadius: 8,
            padding: 16,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--ld-semantic-font-body-medium-family)',
              fontSize: 'var(--ld-semantic-font-body-medium-size, 16px)',
              lineHeight:
                'var(--ld-semantic-font-body-medium-lineheight, 24px)',
              fontWeight: 700,
              color: 'var(--ld-semantic-color-text, #2e2f32)',
            }}
          >
            Personal information
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 16,
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 64,
                height: 64,
                borderRadius: '999px',
                backgroundColor: '#c5c5c5',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                lineHeight: '20px',
              }}
            >
              {initials}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <div style={{ width: 280 }}>
              <FieldLabel>First name (required)</FieldLabel>
              <TextInput
                value={formValues.firstName}
                onChange={(value) =>
                  setFormValues((current) => ({
                    ...current,
                    firstName: value,
                  }))
                }
              />
            </div>
            <div style={{ width: 280 }}>
              <FieldLabel>Last name (required)</FieldLabel>
              <TextInput
                value={formValues.lastName}
                onChange={(value) =>
                  setFormValues((current) => ({
                    ...current,
                    lastName: value,
                  }))
                }
              />
            </div>
          </div>

          <div style={{ marginTop: 12, width: 280 }}>
            <FieldLabel>Email id (required)</FieldLabel>
            <TextInput
              value={formValues.email}
              onChange={(value) =>
                setFormValues((current) => ({
                  ...current,
                  email: value,
                }))
              }
            />
          </div>

          <div style={{ marginTop: 12, width: 280 }}>
            <FieldLabel disabled>Role</FieldLabel>
            <TextInput value="Super Admin" readOnly disabled />
          </div>
        </div>

        <div
          style={{
            width: '100%',
            maxWidth: 800,
            backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
            border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            borderRadius: 8,
            padding: 16,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--ld-semantic-font-body-medium-family)',
              fontSize: 'var(--ld-semantic-font-body-medium-size, 16px)',
              lineHeight:
                'var(--ld-semantic-font-body-medium-lineheight, 24px)',
              fontWeight: 700,
              color: 'var(--ld-semantic-color-text, #2e2f32)',
            }}
          >
            User preference
          </h2>

          <div style={{ marginTop: 12, width: 280 }}>
            <FieldLabel disabled>Language</FieldLabel>
            <TextInput value="English" readOnly disabled />
          </div>

          <div style={{ marginTop: 12, width: 280 }}>
            <FieldLabel disabled>Time zone</FieldLabel>
            <TextInput
              value="UTC-06:00 Central time (US & Canada)"
              readOnly
              disabled
            />
          </div>
        </div>

        <div
          style={{
            width: '100%',
            maxWidth: 800,
            backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
            border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            borderRadius: 8,
            padding: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--ld-semantic-font-body-medium-family)',
                fontSize: 'var(--ld-semantic-font-body-medium-size, 16px)',
                lineHeight:
                  'var(--ld-semantic-font-body-medium-lineheight, 24px)',
                fontWeight: 700,
                color: 'var(--ld-semantic-color-text, #2e2f32)',
              }}
            >
              Account access
            </h2>
            <LDButton variant="secondary" size="small">
              Edit access
            </LDButton>
          </div>

          <div style={{ marginTop: 12, display: 'flex' }}>
            <div style={{ width: 160 }}>
              <div
                style={{ fontSize: 14, lineHeight: '20px', fontWeight: 700 }}
              >
                Company
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#2e2f32',
                }}
              >
                Pepsi.co
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{ fontSize: 14, lineHeight: '20px', fontWeight: 700 }}
              >
                App access
              </div>
              <div
                style={{
                  marginTop: 12,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                {[
                  'Customer Perception',
                  'Shopper behavior',
                  'Insights Activation',
                  'Digital Landscape',
                  'Report builder',
                ].map((label) => (
                  <Tag key={label} color="gray" variant="tertiary">
                    {label}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            width: '100%',
            maxWidth: 800,
            backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
            border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            borderRadius: 8,
            padding: 16,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--ld-semantic-font-body-medium-family)',
              fontSize: 'var(--ld-semantic-font-body-medium-size, 16px)',
              lineHeight:
                'var(--ld-semantic-font-body-medium-lineheight, 24px)',
              fontWeight: 700,
              color: 'var(--ld-semantic-color-text, #2e2f32)',
            }}
          >
            Customer Perception cost center
          </h2>

          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: 14,
              lineHeight: '20px',
              color: 'var(--ld-semantic-color-text-subtle, #515357)',
              fontFamily: 'var(--ld-semantic-font-body-small-family)',
            }}
          >
            Assign user to one of the available cost centers in order to
            allocate funds for their surveys
          </p>

          <div style={{ marginTop: 16, width: 280 }}>
            <label
              htmlFor="profile-cost-center-access"
              style={{
                display: 'block',
                marginBottom: 4,
                fontSize: 14,
                lineHeight: '20px',
                color: 'var(--ld-semantic-color-text, #2e2f32)',
                fontFamily: 'var(--ld-semantic-font-body-small-family)',
              }}
            >
              Cost center access
            </label>

            <MenuSingleSelect
              placeholder="Select an option"
              options={menuCostCenterOptions}
              selectedOptionId={selectedCostCenterId}
              onSelect={(optionId) => {
                setSelectedCostCenterId((previous) =>
                  previous === optionId ? undefined : optionId,
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function FieldLabel({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <label
      style={{
        display: 'block',
        marginBottom: 4,
        fontSize: 14,
        lineHeight: '20px',
        color: disabled ? '#babbbe' : '#2e2f32',
        fontFamily: 'var(--ld-semantic-font-body-small-family)',
      }}
    >
      {children}
    </label>
  );
}

function TextInput({
  value,
  readOnly,
  disabled,
  onChange,
}: {
  value: string;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <input
      value={value}
      readOnly={readOnly}
      disabled={disabled}
      onChange={(event) => onChange?.(event.target.value)}
      style={{
        width: '100%',
        height: 32,
        border: `1px solid ${disabled ? '#babbbe' : '#d5d6d8'}`,
        borderRadius: 4,
        padding: '0 12px',
        fontSize: 14,
        lineHeight: '20px',
        color: disabled ? '#babbbe' : '#2e2f32',
        backgroundColor: '#ffffff',
        fontFamily: 'var(--ld-semantic-font-body-small-family)',
      }}
    />
  );
}
