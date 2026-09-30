<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { ArrowUp } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./sortable-data-table.module.css";

export type SortDirection = "asc" | "desc";
export type SortState = { key: string; direction: SortDirection };

export interface DataColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  numeric?: boolean;
  width?: number | string;
}

export interface SortableDataTableProps<T extends Record<string, any>> {
  rows: T[];
  columns: DataColumn<T>[];
  rowKey?: string;
  caption?: string;
  emptyMessage?: string;
  defaultSort?: SortState;
  selectable?: boolean;
  class?: any;
}

const props = withDefaults(defineProps<SortableDataTableProps<any>>(), {
  rowKey: "id",
  emptyMessage: "No data available",
  selectable: false,
});

const prefersReduced = useReducedMotion();
const sort = ref<SortState | null>(props.defaultSort ?? null);
const selectedKeys = ref<Set<string>>(new Set());

function toggleSort(colKey: string) {
  if (sort.value?.key === colKey) {
    if (sort.value.direction === "asc") {
      sort.value = { key: colKey, direction: "desc" };
    } else {
      sort.value = null;
    }
  } else {
    sort.value = { key: colKey, direction: "asc" };
  }
}

const sortedRows = computed(() => {
  if (!sort.value) return props.rows;
  const { key, direction } = sort.value;
  return [...props.rows].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    if (valA == null) return 1;
    if (valB == null) return -1;
    if (valA < valB) return direction === "asc" ? -1 : 1;
    if (valA > valB) return direction === "asc" ? 1 : -1;
    return 0;
  });
});

function toggleSelectRow(key: string) {
  if (selectedKeys.value.has(key)) {
    selectedKeys.value.delete(key);
  } else {
    selectedKeys.value.add(key);
  }
}
</script>

<template>
  <div :class="[styles.container, props.class]">
    <table :class="styles.table">
      <caption v-if="caption" :class="styles.caption">{{ caption }}</caption>
      <thead :class="styles.thead">
        <tr :class="styles.headerRow">
          <th v-if="selectable" :class="styles.selectHeader" />
          <th
            v-for="col in columns"
            :key="col.key"
            :class="[
              styles.th,
              col.numeric ? styles.numeric : undefined,
              col.sortable ? styles.sortable : undefined,
            ]"
            :style="{ width: col.width ? (typeof col.width === 'number' ? `${col.width}px` : col.width) : undefined }"
            @click="col.sortable ? toggleSort(col.key) : undefined"
          >
            <span :class="styles.headerContent">
              <span :class="styles.headerLabel">{{ col.label }}</span>
              <span
                v-if="col.sortable"
                :class="styles.sortIndicator"
                :data-active="sort?.key === col.key ? '' : undefined"
              >
                <ArrowUp
                  :size="12"
                  :style="{
                    transform: sort?.key === col.key && sort.direction === 'desc' ? 'rotate(180deg)' : 'none',
                    transition: prefersReduced ? 'none' : 'transform 0.2s ease',
                  }"
                  aria-hidden="true"
                />
              </span>
            </span>
          </th>
        </tr>
      </thead>

      <tbody :class="styles.tbody">
        <tr v-if="sortedRows.length === 0" :class="styles.emptyRow">
          <td :colspan="columns.length + (selectable ? 1 : 0)" :class="styles.emptyCell">
            {{ emptyMessage }}
          </td>
        </tr>

        <tr
          v-for="row in sortedRows"
          :key="row[rowKey] || JSON.stringify(row)"
          :class="[
            styles.row,
            selectedKeys.has(row[rowKey]) ? styles.selectedRow : undefined,
          ]"
          @click="selectable ? toggleSelectRow(row[rowKey]) : undefined"
        >
          <td v-if="selectable" :class="styles.selectCell">
            <input
              type="checkbox"
              :checked="selectedKeys.has(row[rowKey])"
              :class="styles.checkbox"
              @click.stop="toggleSelectRow(row[rowKey])"
            />
          </td>
          <td
            v-for="col in columns"
            :key="col.key"
            :class="[styles.td, col.numeric ? styles.numeric : undefined]"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
