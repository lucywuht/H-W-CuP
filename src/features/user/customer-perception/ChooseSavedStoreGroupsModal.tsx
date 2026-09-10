import * as React from 'react';

import {
  Button as LDButton,
  Checkbox,
  DvMenuItem,
  DvTable,
  IconButton as LDIconButton,
  LDIcon,
  MenuMultiSelect,
  MenuAction,
  Modal,
  Pagination,
} from '@walmart-dataventures/shared-components';

import './ChooseSavedStoreGroupsModal.css';

type PaginationItems = '5' | '10' | '15' | '20';
type SortDirection = 'asc' | 'desc';

type SavedStoreGroupRow = {
  id: string;
  name: string;
  description: string;
  criteria: 'Hierarchy' | 'Flat list';
  sharing: string;
  owner: string;
  lastEdited: string;
  storeCountLabel: string;
  asOfLabel: string;
  isFavorite: boolean;
};

type SelectOption = {
  id: string;
  label: string;
};

interface ChooseSavedStoreGroupsModalProps {
  isOpen: boolean;
  initialSelectedGroupIds?: string[];
  onApply: (selectedGroupIds: string[]) => void;
  onClose: () => void;
}

const GROUP_SEED_ROWS: SavedStoreGroupRow[] = [
  {
    id: 'grp-northeast',
    name: 'Northeast',
    description: 'Stores in the northeast',
    criteria: 'Hierarchy',
    sharing: 'Not shared',
    owner: 'Sean Dexter',
    lastEdited: '05-10-2025',
    storeCountLabel: '44 Store IDs',
    asOfLabel: 'as of 2:35am today',
    isFavorite: false,
  },
  {
    id: 'grp-west-coast',
    name: 'West Coast',
    description: 'California and Oregon locations',
    criteria: 'Hierarchy',
    sharing: 'Shared with 3',
    owner: 'Maria Chen',
    lastEdited: '06-22-2025',
    storeCountLabel: '67 Store IDs',
    asOfLabel: 'as of 11:12pm yesterday',
    isFavorite: true,
  },
  {
    id: 'grp-southeast',
    name: 'Southeast',
    description: 'Florida and Georgia markets',
    criteria: 'Flat list',
    sharing: 'Not shared',
    owner: 'James Whitfield',
    lastEdited: '04-15-2025',
    storeCountLabel: '31 Store IDs',
    asOfLabel: 'as of 9:08am today',
    isFavorite: false,
  },
  {
    id: 'grp-midwest',
    name: 'Midwest',
    description: 'Central region store cluster',
    criteria: 'Hierarchy',
    sharing: 'Shared with 2',
    owner: 'Avery Johnson',
    lastEdited: '07-01-2025',
    storeCountLabel: '52 Store IDs',
    asOfLabel: 'as of 1:40pm today',
    isFavorite: true,
  },
  {
    id: 'grp-mountain',
    name: 'Mountain',
    description: 'Rocky Mountain locations',
    criteria: 'Flat list',
    sharing: 'Not shared',
    owner: 'Jordan Patel',
    lastEdited: '03-29-2025',
    storeCountLabel: '18 Store IDs',
    asOfLabel: 'as of 10:03am yesterday',
    isFavorite: false,
  },
  {
    id: 'grp-southwest',
    name: 'Southwest',
    description: 'Arizona and New Mexico set',
    criteria: 'Hierarchy',
    sharing: 'Shared with 5',
    owner: 'Priya Singh',
    lastEdited: '06-12-2025',
    storeCountLabel: '39 Store IDs',
    asOfLabel: 'as of 6:25pm today',
    isFavorite: false,
  },
  {
    id: 'grp-new-england',
    name: 'New England',
    description: 'MA, CT, RI, NH and VT stores',
    criteria: 'Flat list',
    sharing: 'Not shared',
    owner: 'Leah Kim',
    lastEdited: '05-03-2025',
    storeCountLabel: '22 Store IDs',
    asOfLabel: 'as of 8:14am today',
    isFavorite: true,
  },
  {
    id: 'grp-pacific-nw',
    name: 'Pacific NW',
    description: 'Washington and Oregon corridor',
    criteria: 'Hierarchy',
    sharing: 'Shared with 1',
    owner: 'Owen Brooks',
    lastEdited: '06-19-2025',
    storeCountLabel: '28 Store IDs',
    asOfLabel: 'as of 4:47pm yesterday',
    isFavorite: false,
  },
  {
    id: 'grp-great-plains',
    name: 'Great Plains',
    description: 'Kansas and Nebraska stores',
    criteria: 'Flat list',
    sharing: 'Not shared',
    owner: 'Noah Rivera',
    lastEdited: '02-21-2025',
    storeCountLabel: '15 Store IDs',
    asOfLabel: 'as of 7:55am today',
    isFavorite: false,
  },
  {
    id: 'grp-mid-atlantic',
    name: 'Mid-Atlantic',
    description: 'PA, NJ and DE area stores',
    criteria: 'Hierarchy',
    sharing: 'Shared with 4',
    owner: 'Ethan Carter',
    lastEdited: '07-08-2025',
    storeCountLabel: '58 Store IDs',
    asOfLabel: 'as of 12:03pm today',
    isFavorite: true,
  },
];

const ALL_GROUPS: SavedStoreGroupRow[] = Array.from(
  { length: 400 },
  (_, index) => {
    if (index < GROUP_SEED_ROWS.length) {
      return GROUP_SEED_ROWS[index];
    }

    const seed = GROUP_SEED_ROWS[index % GROUP_SEED_ROWS.length];
    return {
      ...seed,
      id: `${seed.id}-${index}`,
      name: `${seed.name} ${index + 1}`,
    };
  },
);

function toOptions(values: string[]): SelectOption[] {
  return values.map((value) => ({ id: value, label: value }));
}

function parseDateValue(dateLabel: string): number {
  const [month, day, year] = dateLabel.split('-').map((value) => Number(value));
  return new Date(year, month - 1, day).getTime();
}

function SavedStoreGroupActionsMenu({ groupName }: { groupName: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <MenuAction
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      position="bottomRight"
      zIndex={600}
      trigger={
        <LDIconButton
          ref={triggerRef}
          size="small"
          variant="secondary"
          a11yLabel={`Open actions for ${groupName}`}
          onClick={() => setIsOpen((previous) => !previous)}
        >
          <LDIcon.More size="small" aria-hidden />
        </LDIconButton>
      }
      triggerRef={triggerRef as React.RefObject<HTMLElement>}
    >
      <DvMenuItem onClick={() => setIsOpen(false)}>
        View Group Details
      </DvMenuItem>
      <DvMenuItem onClick={() => setIsOpen(false)}>Edit</DvMenuItem>
      <DvMenuItem onClick={() => setIsOpen(false)}>Duplicate group</DvMenuItem>
      <DvMenuItem onClick={() => setIsOpen(false)}>Refresh count</DvMenuItem>
      <DvMenuItem variant="destructive" onClick={() => setIsOpen(false)}>
        Delete
      </DvMenuItem>
    </MenuAction>
  );
}

export function ChooseSavedStoreGroupsModal({
  isOpen,
  initialSelectedGroupIds,
  onApply,
  onClose,
}: ChooseSavedStoreGroupsModalProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedSharingIds, setSelectedSharingIds] = React.useState<string[]>(
    [],
  );
  const [selectedOwnerIds, setSelectedOwnerIds] = React.useState<string[]>([]);
  const [lastEditedSortDirection, setLastEditedSortDirection] =
    React.useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = React.useState<PaginationItems>('10');
  const [selectedGroupIds, setSelectedGroupIds] = React.useState<string[]>(
    initialSelectedGroupIds ?? [],
  );
  const [favoriteIds, setFavoriteIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedGroupIds(initialSelectedGroupIds ?? []);
    }
  }, [initialSelectedGroupIds, isOpen]);

  const sharingOptions = React.useMemo(
    () =>
      toOptions(Array.from(new Set(ALL_GROUPS.map((group) => group.sharing)))),
    [],
  );

  const ownerOptions = React.useMemo(
    () =>
      toOptions(Array.from(new Set(ALL_GROUPS.map((group) => group.owner)))),
    [],
  );

  const filteredGroups = React.useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matches = ALL_GROUPS.filter((group) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          group.name,
          group.description,
          group.criteria,
          group.sharing,
          group.owner,
          group.lastEdited,
          group.storeCountLabel,
        ].some((value) => value.toLowerCase().includes(normalizedSearch));

      const matchesSharing =
        selectedSharingIds.length === 0 ||
        selectedSharingIds.includes(group.sharing);

      const matchesOwner =
        selectedOwnerIds.length === 0 || selectedOwnerIds.includes(group.owner);

      return matchesSearch && matchesSharing && matchesOwner;
    });

    return [...matches].sort((a, b) => {
      const comparison =
        parseDateValue(a.lastEdited) - parseDateValue(b.lastEdited);
      return lastEditedSortDirection === 'asc' ? comparison : -comparison;
    });
  }, [
    lastEditedSortDirection,
    searchTerm,
    selectedOwnerIds,
    selectedSharingIds,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredGroups.length / Number(itemsPerPage)),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  React.useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  const visibleGroups = React.useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * Number(itemsPerPage);
    return filteredGroups.slice(startIndex, startIndex + Number(itemsPerPage));
  }, [filteredGroups, itemsPerPage, safeCurrentPage]);

  const visibleGroupIds = React.useMemo(
    () => visibleGroups.map((group) => group.id),
    [visibleGroups],
  );

  const allVisibleSelected =
    visibleGroupIds.length > 0 &&
    visibleGroupIds.every((groupId) => selectedGroupIds.includes(groupId));

  const someVisibleSelected =
    visibleGroupIds.some((groupId) => selectedGroupIds.includes(groupId)) &&
    !allVisibleSelected;

  const handleToggleGroup = React.useCallback((groupId: string) => {
    setSelectedGroupIds((current) =>
      current.includes(groupId)
        ? current.filter((selectedId) => selectedId !== groupId)
        : [...current, groupId],
    );
  }, []);

  const handleToggleVisibleGroups = React.useCallback(() => {
    setSelectedGroupIds((current) => {
      if (allVisibleSelected) {
        return current.filter((groupId) => !visibleGroupIds.includes(groupId));
      }

      const nextSelected = new Set(current);
      visibleGroupIds.forEach((groupId) => nextSelected.add(groupId));
      return Array.from(nextSelected);
    });
  }, [allVisibleSelected, visibleGroupIds]);

  const handleToggleFavorite = React.useCallback((groupId: string) => {
    setFavoriteIds((current) =>
      current.includes(groupId)
        ? current.filter((favoriteId) => favoriteId !== groupId)
        : [...current, groupId],
    );
  }, []);

  const handleSearch = React.useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleOpenNewStoreGroupTab = React.useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const newTab = window.open('about:blank', '_blank');
    const pageTitle = 'Add new store group';

    if (newTab?.document) {
      newTab.document.title = pageTitle;
      newTab.document.body.innerHTML = `<main style="font-family: Arial, sans-serif; margin: 24px;"><h1>${pageTitle}</h1><p>This is a placeholder page for creating a new store group.</p></main>`;
    }
  }, []);

  const handleModalClose = React.useCallback(
    (
      event?:
        | React.MouseEvent<HTMLButtonElement, MouseEvent>
        | PointerEvent
        | MouseEvent
        | TouchEvent
        | KeyboardEvent,
    ) => {
      const target = event?.target as HTMLElement | null;
      const isCloseButtonClick =
        target?.closest('[aria-label="Close dialog"]') !== null;

      if (!isCloseButtonClick) {
        return;
      }

      onClose();
    },
    [onClose],
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Choose from saved store groups"
      description="Choose from the saved store groups to narrow down the purchase location"
      size="mega"
      UNSAFE_className="choose-saved-store-groups-modal__overlay"
      actions={
        <div className="choose-saved-store-groups-modal__actions">
          <LDButton
            variant="secondary"
            leading={<LDIcon.Plus size="small" aria-hidden />}
            trailing={<LDIcon.LinkExternal size="small" aria-hidden />}
            onClick={handleOpenNewStoreGroupTab}
          >
            New store group
          </LDButton>
          <LDButton
            variant="primary"
            disabled={selectedGroupIds.length === 0}
            onClick={() => onApply(selectedGroupIds)}
          >
            Add store groups
          </LDButton>
        </div>
      }
    >
      <div className="choose-saved-store-groups-modal__tableShell">
        <DvTable.Toolbar className="survey-activity-toolbar">
          <DvTable.Search
            className="choose-saved-store-groups-modal__search"
            placeholder="Search"
            value={searchTerm}
            onSearch={handleSearch}
            debounceDelay={0}
          />

          <DvTable.Filters className="survey-activity-filters">
            <MenuMultiSelect
              className="choose-saved-store-groups-modal__filter"
              placeholder="Sharing"
              options={sharingOptions}
              selectedOptionIds={selectedSharingIds}
              onApply={(optionIds) => {
                setSelectedSharingIds(optionIds);
                setCurrentPage(1);
              }}
              variant="filter"
              showSelectedCount
            />
            <MenuMultiSelect
              className="choose-saved-store-groups-modal__filter"
              placeholder="Owner"
              options={ownerOptions}
              selectedOptionIds={selectedOwnerIds}
              onApply={(optionIds) => {
                setSelectedOwnerIds(optionIds);
                setCurrentPage(1);
              }}
              variant="filter"
              showSelectedCount
            />
          </DvTable.Filters>
        </DvTable.Toolbar>

        <div className="choose-saved-store-groups-modal__tableViewport">
          <table className="choose-saved-store-groups-modal__table">
            <thead>
              <tr>
                <th className="choose-saved-store-groups-modal__checkboxColumnHeader">
                  <Checkbox
                    checked={allVisibleSelected}
                    indeterminate={someVisibleSelected}
                    label={
                      <span className="choose-saved-store-groups-modal__srOnly">
                        Select all visible groups
                      </span>
                    }
                    onChange={handleToggleVisibleGroups}
                  />
                </th>
                <th className="choose-saved-store-groups-modal__iconColumn">
                  Favorite
                </th>
                <th>Name &amp; Description</th>
                <th>Criteria</th>
                <th>Sharing</th>
                <th>Owner</th>
                <th>
                  <button
                    type="button"
                    className="choose-saved-store-groups-modal__sortableHeader"
                    onClick={() =>
                      setLastEditedSortDirection((current) =>
                        current === 'asc' ? 'desc' : 'asc',
                      )
                    }
                    aria-label={`Sort by last edited ${
                      lastEditedSortDirection === 'asc'
                        ? 'descending'
                        : 'ascending'
                    }`}
                  >
                    <span>Last edited</span>
                    {lastEditedSortDirection === 'asc' ? (
                      <LDIcon.ArrowUp size="small" aria-hidden />
                    ) : (
                      <LDIcon.ArrowDown size="small" aria-hidden />
                    )}
                  </button>
                </th>
                <th>Store count</th>
                <th className="choose-saved-store-groups-modal__iconColumn" />
              </tr>
            </thead>
            <tbody>
              {visibleGroups.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="choose-saved-store-groups-modal__emptyState"
                  >
                    No saved store groups match the selected filters.
                  </td>
                </tr>
              ) : (
                visibleGroups.map((group) => {
                  const isSelected = selectedGroupIds.includes(group.id);
                  const isFavorite = favoriteIds.includes(group.id);

                  return (
                    <tr key={group.id}>
                      <td className="choose-saved-store-groups-modal__checkboxColumnCell">
                        <Checkbox
                          checked={isSelected}
                          label={
                            <span className="choose-saved-store-groups-modal__srOnly">
                              Select group {group.name}
                            </span>
                          }
                          onChange={() => handleToggleGroup(group.id)}
                        />
                      </td>
                      <td className="choose-saved-store-groups-modal__iconColumnCell">
                        <LDIconButton
                          size="small"
                          variant="secondary"
                          a11yLabel={
                            isFavorite
                              ? `Remove ${group.name} from favorites`
                              : `Add ${group.name} to favorites`
                          }
                          onClick={() => handleToggleFavorite(group.id)}
                        >
                          {isFavorite ? (
                            <LDIcon.StarFill size="small" aria-hidden />
                          ) : (
                            <LDIcon.Star size="small" aria-hidden />
                          )}
                        </LDIconButton>
                      </td>
                      <td>
                        <div className="choose-saved-store-groups-modal__twoLineCell">
                          <span className="choose-saved-store-groups-modal__linePrimary">
                            {group.name}
                          </span>
                          <span className="choose-saved-store-groups-modal__lineSecondary">
                            {group.description}
                          </span>
                        </div>
                      </td>
                      <td>{group.criteria}</td>
                      <td>{group.sharing}</td>
                      <td>{group.owner}</td>
                      <td>{group.lastEdited}</td>
                      <td>
                        <div className="choose-saved-store-groups-modal__twoLineCell">
                          <span className="choose-saved-store-groups-modal__linePrimary">
                            {group.storeCountLabel}
                          </span>
                          <span className="choose-saved-store-groups-modal__lineSecondary">
                            {group.asOfLabel}
                          </span>
                        </div>
                      </td>
                      <td className="choose-saved-store-groups-modal__iconColumnCell">
                        <SavedStoreGroupActionsMenu groupName={group.name} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="choose-saved-store-groups-modal__pagination">
          <Pagination
            currentPage={safeCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
            setCurrentPage={(value) => {
              const parsedValue = Number(value);
              if (!Number.isNaN(parsedValue)) {
                setCurrentPage(parsedValue);
              }
            }}
            totalItemCount={filteredGroups.length}
          />
        </div>
      </div>
    </Modal>
  );
}

export default ChooseSavedStoreGroupsModal;
