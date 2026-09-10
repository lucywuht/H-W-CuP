import * as React from 'react';

import {
  Button as LDButton,
  Checkbox,
  DvTable,
  LDIcon,
  MenuMultiSelect,
  Modal,
  Pagination,
} from '@walmart-dataventures/shared-components';

import './ChooseWalmartStoresModal.css';

type PaginationItems = '5' | '10' | '15' | '20';

type StoreRow = {
  id: string;
  storeNumber: string;
  storeType: string;
  region: string;
  state: string;
  address: string;
};

type SelectOption = {
  id: string;
  label: string;
};

interface ChooseWalmartStoresModalProps {
  isOpen: boolean;
  initialSelectedStoreIds?: string[];
  onApply: (selectedStoreIds: string[]) => void;
  onClose: () => void;
}

const STORE_SEED_ROWS: StoreRow[] = [
  {
    id: '1234-1',
    storeNumber: '1234',
    storeType: 'Walmart Supercenter',
    region: 'Northeast region',
    state: 'Maine',
    address: '753 Willow Blvd',
  },
  {
    id: '1234-2',
    storeNumber: '1234',
    storeType: 'Convenience store',
    region: 'Northeast region',
    state: 'Maine',
    address: '159 Spruce Ave',
  },
  {
    id: '3456',
    storeNumber: '3456',
    storeType: 'Neighborhood Market',
    region: 'South region',
    state: 'Florida',
    address: '123 Palm St',
  },
  {
    id: '2345',
    storeNumber: '2345',
    storeType: 'Walmart Store',
    region: 'Midwest region',
    state: 'Illinois',
    address: '456 Oak Ave',
  },
  {
    id: '6789',
    storeNumber: '6789',
    storeType: 'Walmart Supercenter',
    region: 'West region',
    state: 'California',
    address: '789 Maple Dr',
  },
  {
    id: '1230',
    storeNumber: '1230',
    storeType: 'Neighborhood Market',
    region: 'Northeast region',
    state: 'New York',
    address: '321 Birch Ln',
  },
  {
    id: '3450',
    storeNumber: '3450',
    storeType: 'Walmart Store',
    region: 'South region',
    state: 'Texas',
    address: '654 Cedar Ct',
  },
  {
    id: '2310',
    storeNumber: '2310',
    storeType: 'Convenience store',
    region: 'Midwest region',
    state: 'Ohio',
    address: '987 Elm St',
  },
  {
    id: '4300',
    storeNumber: '4300',
    storeType: 'Neighborhood Market',
    region: 'West region',
    state: 'Washington',
    address: '159 Spruce Ave',
  },
  {
    id: '3214',
    storeNumber: '3214',
    storeType: 'Walmart Store',
    region: 'Northeast region',
    state: 'Massachusetts',
    address: '753 Willow Blvd',
  },
];

const ALL_STORES: StoreRow[] = Array.from({ length: 400 }, (_, index) => {
  if (index < STORE_SEED_ROWS.length) {
    return STORE_SEED_ROWS[index];
  }

  const seed = STORE_SEED_ROWS[index % STORE_SEED_ROWS.length];
  const generatedStoreNumber = String(1000 + index);

  return {
    ...seed,
    id: `${generatedStoreNumber}-${index}`,
    storeNumber: generatedStoreNumber,
    address: `${100 + index} ${seed.address.split(' ').slice(1).join(' ')}`,
  };
});

function toOptions(values: string[]): SelectOption[] {
  return values.map((value) => ({ id: value, label: value }));
}

export function ChooseWalmartStoresModal({
  isOpen,
  initialSelectedStoreIds,
  onApply,
  onClose,
}: ChooseWalmartStoresModalProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStoreTypeIds, setSelectedStoreTypeIds] = React.useState<
    string[]
  >([]);
  const [selectedRegionIds, setSelectedRegionIds] = React.useState<string[]>(
    [],
  );
  const [selectedStateIds, setSelectedStateIds] = React.useState<string[]>([]);
  const [storeNumberSortDirection, setStoreNumberSortDirection] =
    React.useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = React.useState<PaginationItems>('10');
  const [selectedStoreIds, setSelectedStoreIds] = React.useState<string[]>(
    initialSelectedStoreIds ?? [],
  );

  React.useEffect(() => {
    if (isOpen) {
      setSelectedStoreIds(initialSelectedStoreIds ?? []);
    }
  }, [initialSelectedStoreIds, isOpen]);

  const storeTypeOptions = React.useMemo(() => {
    return toOptions(
      Array.from(new Set(ALL_STORES.map((store) => store.storeType))),
    );
  }, []);

  const regionOptions = React.useMemo(() => {
    return toOptions(
      Array.from(new Set(ALL_STORES.map((store) => store.region))),
    );
  }, []);

  const stateOptions = React.useMemo(() => {
    const storesForStateOptions = selectedRegionIds.length
      ? ALL_STORES.filter((store) => selectedRegionIds.includes(store.region))
      : ALL_STORES;

    const dynamicOptions = toOptions(
      Array.from(
        new Set(storesForStateOptions.map((store) => store.state)),
      ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
    );

    return dynamicOptions;
  }, [selectedRegionIds]);

  React.useEffect(() => {
    if (selectedStateIds.length === 0) {
      return;
    }

    const availableStateIds = new Set(stateOptions.map((option) => option.id));
    const nextSelectedStates = selectedStateIds.filter((id) =>
      availableStateIds.has(id),
    );

    if (nextSelectedStates.length !== selectedStateIds.length) {
      setSelectedStateIds(nextSelectedStates);
      setCurrentPage(1);
    }
  }, [selectedStateIds, stateOptions]);

  const filteredStores = React.useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matches = ALL_STORES.filter((store) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          store.storeNumber,
          store.storeType,
          store.region,
          store.state,
          store.address,
        ].some((value) => value.toLowerCase().includes(normalizedSearch));

      const matchesStoreType =
        selectedStoreTypeIds.length === 0 ||
        selectedStoreTypeIds.includes(store.storeType);
      const matchesRegion =
        selectedRegionIds.length === 0 ||
        selectedRegionIds.includes(store.region);
      const matchesState =
        selectedStateIds.length === 0 || selectedStateIds.includes(store.state);

      return matchesSearch && matchesStoreType && matchesRegion && matchesState;
    });

    return [...matches].sort((a, b) => {
      const aNum = Number(a.storeNumber);
      const bNum = Number(b.storeNumber);

      const numericComparison =
        Number.isNaN(aNum) || Number.isNaN(bNum)
          ? a.storeNumber.localeCompare(b.storeNumber, undefined, {
              numeric: true,
              sensitivity: 'base',
            })
          : aNum - bNum;

      return storeNumberSortDirection === 'asc'
        ? numericComparison
        : -numericComparison;
    });
  }, [
    searchTerm,
    selectedRegionIds,
    selectedStateIds,
    selectedStoreTypeIds,
    storeNumberSortDirection,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStores.length / Number(itemsPerPage)),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  React.useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  const visibleStores = React.useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * Number(itemsPerPage);
    return filteredStores.slice(startIndex, startIndex + Number(itemsPerPage));
  }, [filteredStores, itemsPerPage, safeCurrentPage]);

  const visibleStoreIds = React.useMemo(
    () => visibleStores.map((store) => store.id),
    [visibleStores],
  );

  const allVisibleSelected =
    visibleStoreIds.length > 0 &&
    visibleStoreIds.every((id) => selectedStoreIds.includes(id));
  const someVisibleSelected =
    visibleStoreIds.some((id) => selectedStoreIds.includes(id)) &&
    !allVisibleSelected;

  const handleToggleStore = React.useCallback((storeId: string) => {
    setSelectedStoreIds((current) =>
      current.includes(storeId)
        ? current.filter((id) => id !== storeId)
        : [...current, storeId],
    );
  }, []);

  const handleToggleVisibleStores = React.useCallback(() => {
    setSelectedStoreIds((current) => {
      if (allVisibleSelected) {
        return current.filter((id) => !visibleStoreIds.includes(id));
      }

      const next = new Set(current);
      visibleStoreIds.forEach((id) => next.add(id));
      return Array.from(next);
    });
  }, [allVisibleSelected, visibleStoreIds]);

  const handleStoreTypeApply = React.useCallback((optionIds: string[]) => {
    setSelectedStoreTypeIds(optionIds);
    setCurrentPage(1);
  }, []);

  const handleRegionApply = React.useCallback((optionIds: string[]) => {
    setSelectedRegionIds(optionIds);
    setCurrentPage(1);
  }, []);

  const handleStateApply = React.useCallback((optionIds: string[]) => {
    setSelectedStateIds(optionIds);
    setCurrentPage(1);
  }, []);

  const handleSearch = React.useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleStoreNumberSortToggle = React.useCallback(() => {
    setStoreNumberSortDirection((current) =>
      current === 'asc' ? 'desc' : 'asc',
    );
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
      title="Select Walmart stores"
      description="Choose from the store list to narrow down the purchase location"
      size="mega"
      UNSAFE_className="choose-walmart-stores-modal__overlay"
      actions={
        <div className="choose-walmart-stores-modal__actions">
          <LDButton variant="secondary" onClick={onClose}>
            Cancel
          </LDButton>
          <LDButton
            variant="primary"
            disabled={selectedStoreIds.length === 0}
            onClick={() => onApply(selectedStoreIds)}
          >
            Add stores
          </LDButton>
        </div>
      }
    >
      <div className="choose-walmart-stores-modal__tableShell">
        <DvTable.Toolbar className="survey-activity-toolbar">
          <DvTable.Search
            className="choose-walmart-stores-modal__search"
            placeholder="Search"
            value={searchTerm}
            onSearch={handleSearch}
            debounceDelay={0}
          />
          <DvTable.Filters className="survey-activity-filters">
            <MenuMultiSelect
              className="choose-walmart-stores-modal__filter"
              placeholder="Store type"
              options={storeTypeOptions}
              selectedOptionIds={selectedStoreTypeIds}
              onApply={(optionIds) => handleStoreTypeApply(optionIds)}
              variant="filter"
              showSelectedCount
            />
            <MenuMultiSelect
              className="choose-walmart-stores-modal__filter"
              placeholder="Region"
              options={regionOptions}
              selectedOptionIds={selectedRegionIds}
              onApply={(optionIds) => handleRegionApply(optionIds)}
              variant="filter"
              showSelectedCount
            />
            <MenuMultiSelect
              className="choose-walmart-stores-modal__filter"
              placeholder="State"
              options={stateOptions}
              selectedOptionIds={selectedStateIds}
              onApply={(optionIds) => handleStateApply(optionIds)}
              variant="filter"
              showSelectedCount
            />
          </DvTable.Filters>
        </DvTable.Toolbar>

        <div className="choose-walmart-stores-modal__tableViewport">
          <table className="choose-walmart-stores-modal__table">
            <thead>
              <tr>
                <th className="choose-walmart-stores-modal__checkboxColumnHeader">
                  <Checkbox
                    checked={allVisibleSelected}
                    indeterminate={someVisibleSelected}
                    label={
                      <span className="choose-walmart-stores-modal__srOnly">
                        Select all visible stores
                      </span>
                    }
                    onChange={handleToggleVisibleStores}
                  />
                </th>
                <th>
                  <button
                    type="button"
                    className="choose-walmart-stores-modal__sortableHeader"
                    onClick={handleStoreNumberSortToggle}
                    aria-label={`Sort by Store id ${
                      storeNumberSortDirection === 'asc'
                        ? 'descending'
                        : 'ascending'
                    }`}
                  >
                    <span>Store id</span>
                    {storeNumberSortDirection === 'asc' ? (
                      <LDIcon.ArrowUp size="small" aria-hidden />
                    ) : (
                      <LDIcon.ArrowDown size="small" aria-hidden />
                    )}
                  </button>
                </th>
                <th>Store type</th>
                <th>Region</th>
                <th>State</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {visibleStores.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="choose-walmart-stores-modal__emptyState"
                  >
                    No stores match the selected filters.
                  </td>
                </tr>
              ) : (
                visibleStores.map((store) => {
                  const isSelected = selectedStoreIds.includes(store.id);

                  return (
                    <tr key={store.id}>
                      <td className="choose-walmart-stores-modal__checkboxColumnCell">
                        <Checkbox
                          checked={isSelected}
                          label={
                            <span className="choose-walmart-stores-modal__srOnly">
                              Select store id {store.storeNumber}
                            </span>
                          }
                          onChange={() => handleToggleStore(store.id)}
                        />
                      </td>
                      <td>{store.storeNumber}</td>
                      <td>{store.storeType}</td>
                      <td>{store.region}</td>
                      <td>{store.state}</td>
                      <td>{store.address}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="choose-walmart-stores-modal__pagination">
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
            totalItemCount={filteredStores.length}
          />
        </div>
      </div>
    </Modal>
  );
}

export default ChooseWalmartStoresModal;
