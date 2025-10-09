'use client';

import React from 'react';
import { Project, FilterOptions } from '@/types';
import { IoSearch } from 'react-icons/io5';

interface ProjectFiltersProps {
  projects: Project[];
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  projects,
  filters,
  onFilterChange
}) => {
  // Extract unique categories and technologies
  const categories = Array.from(new Set(projects.map(p => p.category).filter(Boolean)));
  const technologies = Array.from(new Set(projects.flatMap(p => p.technologies)));

  const handleChange = (key: keyof FilterOptions, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value || undefined
    });
  };

  return (
    <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search projects..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Category Filter */}
      <select
        value={filters.category || ''}
        onChange={(e) => handleChange('category', e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Technology Filter */}
      <select
        value={filters.technology || ''}
        onChange={(e) => handleChange('technology', e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Technologies</option>
        {technologies.map((tech) => (
          <option key={tech} value={tech}>
            {tech}
          </option>
        ))}
      </select>

      {/* Clear Filters */}
      {(filters.search || filters.category || filters.technology) && (
        <button
          onClick={() => onFilterChange({})}
          className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default ProjectFilters;