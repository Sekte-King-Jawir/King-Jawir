'use client'

import { useState } from 'react'
import styles from './FilterSidebar.module.css'

interface FilterOption {
  id: string
  name: string
  count?: number | undefined
}

interface FilterGroup {
  title: string
  key: string
  options: FilterOption[]
  searchable?: boolean | undefined
}

interface FilterSidebarProps {
  filterGroups: FilterGroup[]
  selectedFilters: Record<string, string[]>
  onFilterChange: (key: string, values: string[]) => void
}

export function FilterSidebar({
  filterGroups,
  selectedFilters,
  onFilterChange,
}: FilterSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    filterGroups.reduce((acc, group) => ({ ...acc, [group.key]: true }), {})
  )
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({})

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleCheckboxChange = (groupKey: string, optionId: string) => {
    const currentValues = selectedFilters[groupKey] || []
    const newValues = currentValues.includes(optionId)
      ? currentValues.filter(v => v !== optionId)
      : [...currentValues, optionId]
    onFilterChange(groupKey, newValues)
  }

  const handleSearchChange = (groupKey: string, term: string) => {
    setSearchTerms(prev => ({ ...prev, [groupKey]: term }))
  }

  const getFilteredOptions = (group: FilterGroup) => {
    const searchTerm = searchTerms[group.key]?.toLowerCase() || ''
    if (!searchTerm) return group.options
    return group.options.filter(option => option.name.toLowerCase().includes(searchTerm))
  }

  return (
    <aside className={styles.sidebar}>
      {filterGroups.map(group => (
        <div key={group.key} className={styles.filterGroup}>
          <button
            className={styles.groupHeader}
            onClick={() => toggleGroup(group.key)}
            aria-expanded={expandedGroups[group.key]}
          >
            <span className={styles.groupTitle}>{group.title}</span>
            <span className={styles.chevron}>{expandedGroups[group.key] ? '▲' : '▼'}</span>
          </button>

          {expandedGroups[group.key] && (
            <div className={styles.groupContent}>
              {group.searchable && (
                <div className={styles.searchWrapper}>
                  <input
                    type="text"
                    placeholder="Search"
                    className={styles.searchInput}
                    value={searchTerms[group.key] || ''}
                    onChange={e => handleSearchChange(group.key, e.target.value)}
                  />
                </div>
              )}

              <div className={styles.optionsList}>
                {getFilteredOptions(group).map(option => (
                  <label key={option.id} className={styles.optionLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={(selectedFilters[group.key] || []).includes(option.id)}
                      onChange={() => handleCheckboxChange(group.key, option.id)}
                    />
                    <span className={styles.optionName}>{option.name}</span>
                    {option.count !== undefined && (
                      <span className={styles.optionCount}>{option.count}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </aside>
  )
}
