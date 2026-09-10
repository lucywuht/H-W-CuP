import * as React from 'react';

import { PageHeader } from '@walmart-dataventures/shared-components';

type UserDetailsPageProps = {
  userId: string;
  userName: string;
  userEmail: string;
  onNavigateToAdmin: () => void;
  onBackToUserManagement: () => void;
};

export function UserDetailsPage({
  userId,
  userName,
  userEmail,
  onNavigateToAdmin,
  onBackToUserManagement,
}: UserDetailsPageProps) {
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
                onBackToUserManagement();
              },
            },
            {
              label: userName,
              href: '#',
              isCurrent: true,
            },
          ]}
          description="Placeholder page for user details"
        >
          {userName}
        </PageHeader>
      </div>

      <div style={{ padding: 24 }}>
        <div
          style={{
            backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
            border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            borderRadius: 8,
            padding: 16,
            maxWidth: 560,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: '20px',
              color: 'var(--ld-semantic-color-text-subtle, #515357)',
            }}
          >
            Placeholder content for user details page.
          </p>
          <p
            style={{
              margin: '8px 0 0 0',
              fontSize: 14,
              lineHeight: '20px',
              color: 'var(--ld-semantic-color-text-subtle, #515357)',
            }}
          >
            User ID: {userId}
          </p>
          <p
            style={{
              margin: '8px 0 0 0',
              fontSize: 14,
              lineHeight: '20px',
              color: 'var(--ld-semantic-color-text-subtle, #515357)',
            }}
          >
            Email: {userEmail}
          </p>
        </div>
      </div>
    </>
  );
}
