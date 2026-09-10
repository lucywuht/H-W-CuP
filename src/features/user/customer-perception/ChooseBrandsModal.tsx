import * as React from 'react';

import {
  Button as LDButton,
  Checkbox,
  DvTable,
  LDIcon,
  Modal,
  Pagination,
  Radio,
} from '@walmart-dataventures/shared-components';

import './ChooseBrandsModal.css';

type PaginationItems = '5' | '10' | '15' | '20';

type BrandRow = {
  id: string;
  name: string;
  itemCount: number;
  visibility: 'all' | 'company';
  sortOrder: number;
};

type BrandScope = 'all-brands' | 'select-brands';

interface ChooseBrandsModalProps {
  isOpen: boolean;
  initialSelectedBrandIds?: string[];
  onApply: (selectedBrandIds: string[]) => void;
  onClose: () => void;
}

const BRAND_ROWS: BrandRow[] = [
  {
    id: 'brand-equate',
    name: 'Equate',
    itemCount: 34,
    visibility: 'company',
    sortOrder: 400,
  },
  {
    id: 'brand-great-value',
    name: 'Great Value',
    itemCount: 82,
    visibility: 'all',
    sortOrder: 399,
  },
  {
    id: 'brand-spark',
    name: 'Spark Create Imagine',
    itemCount: 17,
    visibility: 'company',
    sortOrder: 398,
  },
  {
    id: 'brand-onn',
    name: 'onn',
    itemCount: 91,
    visibility: 'all',
    sortOrder: 397,
  },
  {
    id: 'brand-mainstays',
    name: 'Mainstays',
    itemCount: 48,
    visibility: 'company',
    sortOrder: 396,
  },
  {
    id: 'brand-hart',
    name: 'Hart',
    itemCount: 63,
    visibility: 'company',
    sortOrder: 395,
  },
  {
    id: 'brand-bettergoods',
    name: 'Bettergoods',
    itemCount: 25,
    visibility: 'all',
    sortOrder: 394,
  },
  {
    id: 'brand-parents-choice',
    name: 'Parent’s Choice',
    itemCount: 74,
    visibility: 'company',
    sortOrder: 393,
  },
  {
    id: 'brand-brookstone',
    name: 'Brookstone',
    itemCount: 39,
    visibility: 'company',
    sortOrder: 392,
  },
  {
    id: 'brand-acer',
    name: 'Acer',
    itemCount: 12,
    visibility: 'all',
    sortOrder: 391,
  },
];

const ALL_BRANDS: BrandRow[] = Array.from({ length: 400 }, (_, index) => {
  if (index < BRAND_ROWS.length) {
    return BRAND_ROWS[index];
  }

  const seed = BRAND_ROWS[index % BRAND_ROWS.length];

  return {
    ...seed,
    id: `${seed.id}-${index}`,
    name: `${seed.name} ${index + 1}`,
    itemCount: seed.itemCount + (index % 7) * 3,
    visibility: index % 2 === 0 ? 'company' : 'all',
    sortOrder: 390 - index,
  };
});

export function ChooseBrandsModal({
  isOpen,
  initialSelectedBrandIds,
  onApply,
  onClose,
}: ChooseBrandsModalProps) {
  const [brandScope, setBrandScope] = React.useState<BrandScope>('all-brands');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedBrandIds, setSelectedBrandIds] = React.useState<string[]>(
    initialSelectedBrandIds ?? [],
  );
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = React.useState<PaginationItems>('10');
  const [brandSortDirection, setBrandSortDirection] = React.useState<
    'asc' | 'desc'
  >('asc');

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    setBrandScope('all-brands');
    setSelectedBrandIds(initialSelectedBrandIds ?? []);
    setSearchTerm('');
    setCurrentPage(1);
    setItemsPerPage('10');
    setBrandSortDirection('asc');
  }, [initialSelectedBrandIds, isOpen]);

  const filteredBrands = React.useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matches = ALL_BRANDS.filter((brand) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [brand.name, String(brand.itemCount)].some((value) =>
          value.toLowerCase().includes(normalizedSearch),
        );

      const matchesScope =
        brandScope === 'all-brands' ||
        (brandScope === 'select-brands' && brand.visibility === 'company');

      return matchesSearch && matchesScope;
    });

    return [...matches].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name, undefined, {
        sensitivity: 'base',
        numeric: true,
      });

      return brandSortDirection === 'asc' ? comparison : -comparison;
    });
  }, [brandScope, brandSortDirection, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBrands.length / Number(itemsPerPage)),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  React.useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  const visibleBrands = React.useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * Number(itemsPerPage);
    return filteredBrands.slice(startIndex, startIndex + Number(itemsPerPage));
  }, [filteredBrands, itemsPerPage, safeCurrentPage]);

  const visibleBrandIds = React.useMemo(
    () => visibleBrands.map((brand) => brand.id),
    [visibleBrands],
  );

  const allVisibleSelected =
    visibleBrandIds.length > 0 &&
    visibleBrandIds.every((brandId) => selectedBrandIds.includes(brandId));

  const someVisibleSelected =
    visibleBrandIds.some((brandId) => selectedBrandIds.includes(brandId)) &&
    !allVisibleSelected;

  const handleToggleBrand = React.useCallback((brandId: string) => {
    setSelectedBrandIds((current) =>
      current.includes(brandId)
        ? current.filter((selectedId) => selectedId !== brandId)
        : [...current, brandId],
    );
  }, []);

  const handleToggleVisibleBrands = React.useCallback(() => {
    setSelectedBrandIds((current) => {
      if (allVisibleSelected) {
        return current.filter((brandId) => !visibleBrandIds.includes(brandId));
      }

      const nextSelected = new Set(current);
      visibleBrandIds.forEach((brandId) => nextSelected.add(brandId));
      return Array.from(nextSelected);
    });
  }, [allVisibleSelected, visibleBrandIds]);

  const handleSearch = React.useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
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

  const handleApply = React.useCallback(() => {
    onApply(selectedBrandIds);
  }, [onApply, selectedBrandIds]);

  const handleReset = React.useCallback(() => {
    setBrandScope('all-brands');
    setSearchTerm('');
    setSelectedBrandIds([]);
    setCurrentPage(1);
    setItemsPerPage('10');
    setBrandSortDirection('asc');
  }, []);

  const canApply = selectedBrandIds.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Choose brands"
      description="Choose all brands or pick specific brands to narrow the audience"
      size="mega"
      UNSAFE_className="choose-brands-modal__overlay"
      actions={
        <div className="choose-brands-modal__actions">
          <div className="choose-brands-modal__actionsLeft">
            <LDButton variant="tertiary" onClick={handleReset}>
              Reset
            </LDButton>
          </div>
          <div className="choose-brands-modal__actionsRight">
            <LDButton variant="secondary" onClick={onClose}>
              Cancel
            </LDButton>
            <LDButton
              variant="primary"
              disabled={!canApply}
              onClick={handleApply}
            >
              Add brands
            </LDButton>
          </div>
        </div>
      }
    >
      <div className="choose-brands-modal__body">
        <div
          className="choose-brands-modal__radioStack"
          role="radiogroup"
          aria-label="Brand scope"
        >
          <div className="choose-brands-modal__radioRow">
            <Radio
              label="Show all brands"
              name="brand-scope"
              value="all-brands"
              checked={brandScope === 'all-brands'}
              onChange={() => {
                setBrandScope('all-brands');
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="choose-brands-modal__radioRow">
            <Radio
              label="Show my company brands only"
              name="brand-scope"
              value="select-brands"
              checked={brandScope === 'select-brands'}
              onChange={() => {
                setBrandScope('select-brands');
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="choose-brands-modal__tableShell">
          <DvTable.Toolbar className="survey-brand-toolbar">
            <DvTable.Search
              className="choose-brands-modal__search"
              placeholder="Search"
              value={searchTerm}
              onSearch={handleSearch}
              debounceDelay={0}
            />
          </DvTable.Toolbar>

          <div className="choose-brands-modal__tableViewport">
            <table className="choose-brands-modal__table">
              <thead>
                <tr>
                  <th className="choose-brands-modal__checkboxColumnHeader">
                    <Checkbox
                      checked={allVisibleSelected}
                      indeterminate={someVisibleSelected}
                      label={
                        <span className="choose-brands-modal__srOnly">
                          Select all visible brands
                        </span>
                      }
                      onChange={handleToggleVisibleBrands}
                    />
                  </th>
                  <th>
                    <button
                      type="button"
                      className="choose-brands-modal__sortableHeader"
                      onClick={() =>
                        setBrandSortDirection((current) =>
                          current === 'asc' ? 'desc' : 'asc',
                        )
                      }
                      aria-label={`Sort by Brand ${
                        brandSortDirection === 'asc'
                          ? 'descending'
                          : 'ascending'
                      }`}
                    >
                      <span>Brand</span>
                      <LDIcon.ArrowDown
                        size="small"
                        aria-hidden
                        className={
                          brandSortDirection === 'asc'
                            ? 'choose-brands-modal__sortIcon choose-brands-modal__sortIcon--asc'
                            : 'choose-brands-modal__sortIcon'
                        }
                      />
                    </button>
                  </th>
                  <th className="choose-brands-modal__countHeader">
                    Item count
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleBrands.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="choose-brands-modal__emptyState">
                      No brands match the selected search or scope.
                    </td>
                  </tr>
                ) : (
                  visibleBrands.map((brand) => {
                    const isSelected = selectedBrandIds.includes(brand.id);

                    return (
                      <tr key={brand.id}>
                        <td className="choose-brands-modal__checkboxColumnCell">
                          <Checkbox
                            checked={isSelected}
                            label={
                              <span className="choose-brands-modal__srOnly">
                                Select brand {brand.name}
                              </span>
                            }
                            onChange={() => handleToggleBrand(brand.id)}
                          />
                        </td>
                        <td className="choose-brands-modal__nameCell">
                          {brand.name}
                        </td>
                        <td className="choose-brands-modal__countCell">
                          {brand.itemCount}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="choose-brands-modal__pagination">
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
              totalItemCount={filteredBrands.length}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ChooseBrandsModal;
