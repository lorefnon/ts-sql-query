import type { CUSTOMIZED_TABLE_OR_VIEW, ITable, ITableOrView, IView, IWithView, OuterJoinSource, TableOrViewAlias, TABLE_OR_VIEW_ALIAS, TableOrViewRef, OLD, OldTableOrView, OUTER_JOIN_SOURCE, TableOrViewOuterJoin } from "./ITableOrView"
import type { AnyValueSource, IValueSource, RemapValueSourceType, RemapValueSourceTypeWithOptionalType, ValueSourceOf, ValueSourceValueType } from "../expressions/values"
import type { tableOrViewRef, type, viewName } from "./symbols"
import type { AnyDB } from "../databases"
import type { Column, ColumnWithDefaultValue, ComputedColumn, OptionalColumn, PrimaryKeyAutogeneratedColumn } from "./Column"

export type ColumnsOf<TABLE_OR_VIEW extends ITableOrView<any>> = ({ [K in keyof TABLE_OR_VIEW]-?: TABLE_OR_VIEW[K] extends ValueSourceOf<TABLE_OR_VIEW[typeof tableOrViewRef]> & Column ? K : never })[keyof TABLE_OR_VIEW]
type ValueSourcesOf<TABLE_OR_VIEW> = ({ [K in keyof TABLE_OR_VIEW]-?: TABLE_OR_VIEW[K] extends AnyValueSource ? K : never })[keyof TABLE_OR_VIEW]

export type OldValues<TABLE_OR_VIEW extends ITableOrView<any>> = { [K in ValueSourcesOf<TABLE_OR_VIEW>]: RemapValueSourceType<OLD<TABLE_OR_VIEW[typeof tableOrViewRef]>, TABLE_OR_VIEW[K]> } & OldTableOrView<TABLE_OR_VIEW>

export type AliasedTableOrView<TABLE_OR_VIEW extends ITableOrView<any>, ALIAS> = { [K in ValueSourcesOf<TABLE_OR_VIEW>]: RemapValueSourceType<TABLE_OR_VIEW_ALIAS<TABLE_OR_VIEW[typeof tableOrViewRef], ALIAS>, TABLE_OR_VIEW[K]> } & TableOrViewAlias<TABLE_OR_VIEW, ALIAS>
type WithViewColumns<TABLE_OR_VIEW extends ITableOrView<any>, COLUMNS> = { [K in ValueSourcesOf<COLUMNS>]: RemapValueSourceType<TABLE_OR_VIEW[typeof tableOrViewRef], COLUMNS[K]> } & TABLE_OR_VIEW

export type OuterJoinSourceOf<TABLE_OR_VIEW extends ITableOrView<any>, ALIAS> = { [K in ValueSourcesOf<TABLE_OR_VIEW>]: RemapValueSourceTypeWithOptionalType<OUTER_JOIN_SOURCE<TABLE_OR_VIEW[typeof tableOrViewRef], ALIAS>, TABLE_OR_VIEW[K], OuterOptionalTypeOf<TABLE_OR_VIEW[K]>> } & OuterJoinSource<TABLE_OR_VIEW, ALIAS>
export type OuterJoinTableOrView<TABLE_OR_VIEW extends ITableOrView<any>, ALIAS> = { [K in ValueSourcesOf<TABLE_OR_VIEW>]: RemapValueSourceTypeWithOptionalType<OUTER_JOIN_SOURCE<TABLE_OR_VIEW[typeof tableOrViewRef], ALIAS>, TABLE_OR_VIEW[K], OuterOptionalTypeOf<TABLE_OR_VIEW[K]>> } & TableOrViewOuterJoin<TABLE_OR_VIEW, ALIAS>
type OuterOptionalTypeOf<TYPE> = 
    TYPE extends IValueSource<any, any, any, infer OPTIONAL_TYPE> ? (
        'required' extends OPTIONAL_TYPE
        ? 'originallyRequired'
        : OPTIONAL_TYPE
    ) : never

export interface WITH_VIEW<DB extends AnyDB, NAME extends string> extends TableOrViewRef<DB> {
    [viewName]: NAME
    [type]: 'with'
}

type AddAliasMethods<T extends ITableOrView<any>> = T & {
    as<ALIAS extends string>(as: ALIAS): AliasedTableOrView<T, ALIAS>
    forUseInLeftJoin(): OuterJoinSourceOf<T, ''>
    forUseInLeftJoinAs<ALIAS extends string>(as: ALIAS): OuterJoinSourceOf<T, ALIAS>
}

export type WithView<REF extends WITH_VIEW<AnyDB, any>, COLUMNS> = AddAliasMethods<WithViewColumns<IWithView<REF>, COLUMNS>>

type CustomizedTableOrViewType<TABLE_OR_VIEW extends ITableOrView<any>, REF extends TableOrViewRef<AnyDB>> = 
    TABLE_OR_VIEW extends TableOrViewAlias<infer T, infer ALIAS> ? (
        T extends ITable<any> ? TableOrViewAlias<ITable<REF>, ALIAS>
        : T extends IView<any> ? TableOrViewAlias<IView<REF>, ALIAS>
        : T extends IWithView<any> ? TableOrViewAlias<IWithView<REF>, ALIAS>
        : never
    )
    : TABLE_OR_VIEW extends ITable<any> ? ITable<REF>
    : TABLE_OR_VIEW extends IView<any> ? IView<REF>
    : TABLE_OR_VIEW extends IWithView<any> ? IWithView<REF>
    : never

type CustomizedTableOrViewRefFor<TABLE_OR_VIEW extends ITableOrView<any>, NAME> =
    TABLE_OR_VIEW[typeof tableOrViewRef] extends TABLE_OR_VIEW_ALIAS<infer R, infer ALIAS> ? TABLE_OR_VIEW_ALIAS<CUSTOMIZED_TABLE_OR_VIEW<R, NAME>, ALIAS>
    : CUSTOMIZED_TABLE_OR_VIEW<TABLE_OR_VIEW[typeof tableOrViewRef], NAME>

type CustomizedTableOrViewRefForWitNoAlias<TABLE_OR_VIEW extends ITableOrView<any>, NAME> =
    TABLE_OR_VIEW[typeof tableOrViewRef] extends TABLE_OR_VIEW_ALIAS<infer R, any> ? CUSTOMIZED_TABLE_OR_VIEW<R, NAME>
    : CUSTOMIZED_TABLE_OR_VIEW<TABLE_OR_VIEW[typeof tableOrViewRef], NAME>

type CustomizedTableOrViewNoAliasable<TABLE_OR_VIEW extends ITableOrView<any>, NAME> = { [K in ValueSourcesOf<TABLE_OR_VIEW>]: RemapValueSourceType<CustomizedTableOrViewRefFor<TABLE_OR_VIEW, NAME>, TABLE_OR_VIEW[K]> } & CustomizedTableOrViewType<TABLE_OR_VIEW, CustomizedTableOrViewRefForWitNoAlias<TABLE_OR_VIEW, NAME>>

export type CustomizedTableOrView<T extends ITableOrView<any>, NAME extends string> =
    (T extends {as(as: any): any}
    ? AddAliasMethods<CustomizedTableOrViewNoAliasable<T, NAME>>
    : CustomizedTableOrViewNoAliasable<T, NAME>
    ) & { /* added to avoid typescript expansion type, generating better error messages */ }

export type AutogeneratedPrimaryKeyColumnsTypesOf<T extends ITableOrView<any>> = ({ [K in keyof T]-?: 
    T[K] extends ValueSourceOf<T[typeof tableOrViewRef]> & Column 
    ? (
        T[K] extends ComputedColumn
        ? never
        : (
            T[K] extends PrimaryKeyAutogeneratedColumn ? ValueSourceValueType<T[K]> : never
        )
    ) : never 
})[keyof T]

export type ColumnsForSetOf<TYPE extends ITableOrView<any>> = ({ [K in keyof TYPE]-?: 
    TYPE[K] extends ValueSourceOf<TYPE[typeof tableOrViewRef]> & Column
    ? (TYPE[K] extends ComputedColumn ? never : K)
    : never 
})[keyof TYPE]

export type RequiredColumnsForSetOf<T extends ITableOrView<any>> = ({ [K in keyof T]-?: 
    T[K] extends ValueSourceOf<T[typeof tableOrViewRef]>  & Column
    ? (
        T[K] extends ComputedColumn
        ? never
        : (
            T[K] extends OptionalColumn
            ? never 
            : (T[K] extends ColumnWithDefaultValue ? never : K)
        )
    ) : never 
})[keyof T]

export type OptionalColumnsForSetOf<T extends ITableOrView<any>> = ({ [K in keyof T]-?: 
    T[K] extends ValueSourceOf<T[typeof tableOrViewRef]> & Column 
    ? (
        T[K] extends ComputedColumn
        ? never
        : (
            T[K] extends OptionalColumn 
            ? K 
            : (T[K] extends ColumnWithDefaultValue ? K : never)
        )
    ) : never 
})[keyof T]