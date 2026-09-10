import * as React from 'react';

import {
  Button,
  Divider,
  PageHeader,
  Radio,
  Switch,
  TextField,
} from '@walmart-dataventures/shared-components';

type AddSingleUserPageProps = {
  onNavigateToAdmin: () => void;
  onNavigateToUserManagement: () => void;
  onSaveUser: (fullName: string) => void;
};

type AccessLevel = 'admin' | 'regular';

type AppPermissionsState = {
  shopperBehavior: boolean;
  customerPerception: boolean;
  digitalLandscape: boolean;
  customProductGroups: boolean;
};

export function AddSingleUserPage({
  onNavigateToAdmin,
  onNavigateToUserManagement,
  onSaveUser,
}: AddSingleUserPageProps) {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [accessLevel, setAccessLevel] = React.useState<AccessLevel>('regular');
  const [permissions, setPermissions] = React.useState<AppPermissionsState>({
    shopperBehavior: false,
    customerPerception: false,
    digitalLandscape: false,
    customProductGroups: false,
  });

  const hasAtLeastOnePermission = Object.values(permissions).some(Boolean);

  const isSaveDisabled =
    firstName.trim().length === 0 ||
    lastName.trim().length === 0 ||
    email.trim().length === 0 ||
    !hasAtLeastOnePermission;

  const handleSave = () => {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    onSaveUser(fullName);
  };

  const permissionItems: Array<{
    key: keyof AppPermissionsState;
    title: string;
    description: string;
  }> = [
    {
      key: 'shopperBehavior',
      title: 'Shopper behavior',
      description:
        'Gain insights into shopper behavior and trends to optimize product placement and marketing strategies.',
    },
    {
      key: 'customerPerception',
      title: 'Customer Perception',
      description:
        'Understand customer sentiments and perceptions to improve service quality and customer satisfaction.',
    },
    {
      key: 'digitalLandscape',
      title: 'Digital Landscape',
      description:
        'Analyze digital interactions and engagement metrics to enhance online presence and user experience.',
    },
    {
      key: 'customProductGroups',
      title: 'Custom Product Groups',
      description:
        'Create and manage custom product groupings for tailored analysis and reporting.',
    },
  ];

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
              label: 'User Management',
              href: '#',
              onClick: (event) => {
                event.preventDefault();
                onNavigateToUserManagement();
              },
            },
            {
              label: 'Add user',
              href: '#',
              isCurrent: true,
            },
          ]}
          keyCTAsButtonGroup={[
            <Button
              key="cancel"
              variant="secondary"
              size="medium"
              onClick={onNavigateToUserManagement}
            >
              Cancel
            </Button>,
            <Button
              key="save"
              variant="primary"
              size="medium"
              disabled={isSaveDisabled}
              onClick={handleSave}
            >
              Save
            </Button>,
          ]}
        >
          Add user
        </PageHeader>
      </div>

      <div
        style={{
          padding: 24,
          backgroundColor: 'var(--ld-semantic-color-surface-subtle, #f8f8f8)',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 648,
            margin: '0 auto',
            backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
            border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            borderRadius: 8,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <section>
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                lineHeight: '24px',
                fontWeight: 700,
                color: 'var(--ld-semantic-color-text, #2e2f32)',
              }}
            >
              User information
            </h2>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: 14,
                lineHeight: '20px',
                color: 'var(--ld-semantic-color-text-subtle, #515357)',
              }}
            >
              Fields marked with * are required.
            </p>
            <div
              style={{
                marginTop: 16,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 16,
              }}
            >
              <TextField
                label="First name *"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
              <TextField
                label="Last name *"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>
            <div style={{ marginTop: 16, maxWidth: 460 }}>
              <TextField
                label="Email *"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </section>

          <Divider />

          <section>
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                lineHeight: '24px',
                fontWeight: 700,
                color: 'var(--ld-semantic-color-text, #2e2f32)',
              }}
            >
              Access level *
            </h2>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: 14,
                lineHeight: '20px',
                color: 'var(--ld-semantic-color-text-subtle, #515357)',
              }}
            >
              Select one access level for this user.
            </p>
            <div
              style={{
                marginTop: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <Radio
                label="Admin"
                name="access-level"
                value="admin"
                checked={accessLevel === 'admin'}
                onChange={() => setAccessLevel('admin')}
                helperText="Can create, update, and remove users and permissions."
              />
              <Radio
                label="Regular users"
                name="access-level"
                value="regular"
                checked={accessLevel === 'regular'}
                onChange={() => setAccessLevel('regular')}
                helperText="Can access assigned applications and view related data."
              />
            </div>
          </section>

          <Divider />

          <section>
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                lineHeight: '24px',
                fontWeight: 700,
                color: 'var(--ld-semantic-color-text, #2e2f32)',
              }}
            >
              App permissions
            </h2>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: 14,
                lineHeight: '20px',
                color: 'var(--ld-semantic-color-text-subtle, #515357)',
              }}
            >
              Enable access to specific applications for this user.
            </p>
            <div
              style={{
                marginTop: 16,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {permissionItems.map((permission, index) => (
                <div key={permission.key}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 16,
                      padding: '12px 0',
                    }}
                  >
                    <div>
                      <p
                        id={`permission-title-${permission.key}`}
                        style={{
                          margin: 0,
                          fontSize: 16,
                          lineHeight: '22px',
                          fontWeight: 700,
                          color: 'var(--ld-semantic-color-text, #2e2f32)',
                        }}
                      >
                        {permission.title}
                      </p>
                      <p
                        style={{
                          margin: '4px 0 0',
                          fontSize: 14,
                          lineHeight: '20px',
                          color:
                            'var(--ld-semantic-color-text-subtle, #515357)',
                          maxWidth: 680,
                        }}
                      >
                        {permission.description}
                      </p>
                    </div>
                    <Switch
                      a11yLabelledBy={`permission-title-${permission.key}`}
                      isOn={permissions[permission.key]}
                      onClick={() =>
                        setPermissions((current) => ({
                          ...current,
                          [permission.key]: !current[permission.key],
                        }))
                      }
                    />
                  </div>
                  {index < permissionItems.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
