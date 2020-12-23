import type { ITableOrView, TableOrViewRef } from "../utils/ITableOrView"
import type { Default } from "./Default"
import type { AnyDB } from "../databases"
import type { ExecutableSelect } from "./select"
import type { int, double, /*LocalDate, LocalTime, LocalDateTime,*/ stringDouble, stringInt } from "ts-extended-types"
import type { TypeAdapter } from "../TypeAdapter"
import type { booleanValueSourceType, comparableValueSourceType, database, dateTimeValueSourceType, dateValueSourceType, doubleValueSourceType, equalableValueSourceType, ifValueSourceType, intValueSourceType, localDateTimeValueSourceType, localDateValueSourceType, localTimeValueSourceType, nullableValueSourceType, numberValueSourceType, stringDoubleValueSourceType, stringIntValueSourceType, stringNumberValueSourceType, stringValueSourceType, tableOrView, tableOrViewRef, timeValueSourceType, typeSafeStringValueSourceType, valueSourceType } from "../utils/symbols"
import type { ColumnWithDefaultValue } from "../utils/Column"
import { valueType } from "../utils/symbols"

export interface ValueSourceOf<DB extends AnyDB> {
    [valueSourceType]: 'ValueSource'
    [database]: DB
}

export interface ValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE> extends ValueSourceOf<TABLE_OR_VIEW[typeof database]> {
    [tableOrView]: TABLE_OR_VIEW
    [valueType]: TYPE
}

export interface __OptionalRule {
    _isValue(value: any): boolean // Implemented in the sql builders
}

export interface __ValueSourcePrivate {
    __valueType: string
    __typeAdapter?: TypeAdapter
    __isResultOptional(rule: __OptionalRule): boolean
}

export function __getValueSourcePrivate(valueSource: ValueSource<any, any>): __ValueSourcePrivate {
    return valueSource as any
}

export interface NullableValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE> extends ValueSource<TABLE_OR_VIEW, TYPE> {
    [nullableValueSourceType]: 'NullableValueSource'
    isNull(): BooleanValueSource<TABLE_OR_VIEW, boolean>
    isNotNull(): BooleanValueSource<TABLE_OR_VIEW, boolean>
    // Next methods uses this as generic argument to avoid create a circular reference
    // Next methods doen't works on TS 3.5.3, it create a 'Type instantiation is excessively deep and possibly infinite.' (sometimes on UpdateQueryBuilder), a specific implementation will be created
    // valueWhenNull<THIS>(this: THIS, value: MandatoryTypeOf<TYPE>): RemapValueSourceTypeAsMandatory<TABLE_OR_VIEW, THIS>
    // valueWhenNull<THIS, TABLE_OR_VIEW2 extends ITable<DB>>(this: THIS, value: ValueSource<TABLE_OR_VIEW2, MandatoryTypeOf<TYPE>>): RemapValueSourceTypeAsMandatory<TABLE_OR_VIEW | TABLE_OR_VIEW2, THIS>
    // valueWhenNull<THIS, TABLE_OR_VIEW2 extends ITable<DB>>(this: THIS, value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): RemapValueSourceTypeAsOptional<TABLE_OR_VIEW | TABLE_OR_VIEW2, THIS>
    // asOptional<THIS>(this: THIS): RemapValueSourceTypeAsOptional<TABLE_OR_VIEW, THIS>
    valueWhenNull(value: MandatoryTypeOf<TYPE>): NullableValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, MandatoryTypeOf<TYPE>>): NullableValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): NullableValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    asOptional(): NullableValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
}

export interface EqualableValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE> extends NullableValueSource<TABLE_OR_VIEW, TYPE> {
    [equalableValueSourceType]: 'EqualableValueSource'
    equalsIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    equals(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    equals<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    equals<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE  | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE | null | undefined>>
    notEqualsIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notEquals(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notEquals<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notEquals<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE  | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE | null | undefined>>
    isIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    is(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, boolean>
    is<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean>
    is<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean>
    isNotIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, boolean>
    isNot(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, boolean>
    isNot<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean>
    isNot<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean>

    inIfValue(values: TYPE[] | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    inIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    in(values: TYPE[]): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    in(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    in<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    in<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE | null | undefined>>
    in<TABLE_OR_VIEW2 extends ITableOrView<any>>(select: ExecutableSelect<TABLE_OR_VIEW[typeof database], TYPE | null | undefined, TABLE_OR_VIEW2>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2[typeof tableOrViewRef], boolean>
    notInIfValue(values: TYPE[] | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notInIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notIn(values: TYPE[]): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notIn(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notIn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notIn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE | null | undefined>>
    notIn<TABLE_OR_VIEW2 extends ITableOrView<any>>(select: ExecutableSelect<TABLE_OR_VIEW[typeof database], TYPE | null | undefined, TABLE_OR_VIEW2>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2[typeof tableOrViewRef], boolean>
    inN(...value: TYPE[]): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    inN<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(...value: (TYPE | ValueSource<TABLE_OR_VIEW2, TYPE>)[]): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>> // limitation: only one source table
    inN<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(...value: (TYPE | ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>)[]): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE | null | undefined>> // limitation: only one source table
    notInN(...value: TYPE[]): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notInN<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(...value: (TYPE | ValueSource<TABLE_OR_VIEW2, TYPE>)[]): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>> // limitation: only one source table
    notInN<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(...value: (TYPE | ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>)[]): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE | null | undefined>> // limitation: only one source table

    // Redefined methods
    valueWhenNull(value: MandatoryTypeOf<TYPE>): EqualableValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, MandatoryTypeOf<TYPE>>): EqualableValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): EqualableValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    asOptional(): EqualableValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
}

export interface ComparableValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE> extends EqualableValueSource<TABLE_OR_VIEW, TYPE> {
    [comparableValueSourceType]: 'ComparableValueSource'
    smallerIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    smaller(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    smaller<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    smaller<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE | null | undefined>>
    largerIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    larger(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    larger<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    larger<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE | null | undefined>>
    smallAsIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    smallAs(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    smallAs<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    smallAs<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE | null | undefined>>
    largeAsIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    largeAs(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    largeAs<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    largeAs<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE | null | undefined>>
    between(value: TYPE, value2: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    between<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: TYPE, value2: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    between<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: TYPE, value2: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    between<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>, value2: TYPE): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    between<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>, value2: TYPE): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    between<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>, value2: ValueSource<TABLE_OR_VIEW3, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, BooleanOrNullOf<TYPE>>
    between<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>, value2: ValueSource<TABLE_OR_VIEW3, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, boolean | null | undefined>
    between<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>, value2: ValueSource<TABLE_OR_VIEW3, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, boolean | null | undefined>
    between<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>, value2: ValueSource<TABLE_OR_VIEW3, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, boolean | null | undefined>
    notBetween(value: TYPE, value2: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notBetween<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: TYPE, value2: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notBetween<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: TYPE, value2: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notBetween<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>, value2: TYPE): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notBetween<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>, value2: TYPE): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notBetween<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>, value2: ValueSource<TABLE_OR_VIEW3, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, BooleanOrNullOf<TYPE>>
    notBetween<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>, value2: ValueSource<TABLE_OR_VIEW3, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, boolean | null | undefined>
    notBetween<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>, value2: ValueSource<TABLE_OR_VIEW3, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, boolean | null | undefined>
    notBetween<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>, value2: ValueSource<TABLE_OR_VIEW3, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, boolean | null | undefined>
    // Redefined methods
    valueWhenNull(value: MandatoryTypeOf<TYPE>): ComparableValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, MandatoryTypeOf<TYPE>>): ComparableValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): ComparableValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    asOptional(): ComparableValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
}

export interface BooleanValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE /*extends boolean | null | undefined = boolean*/> extends EqualableValueSource<TABLE_OR_VIEW, TYPE> {
    [booleanValueSourceType]: 'BooleanValueSource'
    negate(): BooleanValueSource<TABLE_OR_VIEW, TYPE>
    and(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    and<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IfValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    and<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    and<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IfValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    and<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    or(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    or<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IfValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    or<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    or<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IfValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    or<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    // Redefined methods
    valueWhenNull(value: MandatoryTypeOf<TYPE>): BooleanValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, MandatoryTypeOf<TYPE>>): BooleanValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    asOptional(): BooleanValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
}

export interface IfValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE /*extends boolean | null | undefined = boolean*/> {
    [database]: TABLE_OR_VIEW[typeof database]
    [tableOrView]: TABLE_OR_VIEW
    [valueType]: TYPE
    [ifValueSourceType]: 'IfValueSource'
    and(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    and<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IfValueSource<TABLE_OR_VIEW2, TYPE>): IfValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    and<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    and<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IfValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): IfValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    and<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    or(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    or<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IfValueSource<TABLE_OR_VIEW2, TYPE>): IfValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    or<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    or<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IfValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): IfValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    or<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
}

export interface NumberValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE /*extends number | null | undefined = number*/> extends ComparableValueSource<TABLE_OR_VIEW, TYPE> {
    [numberValueSourceType]: 'NumberValueSource'
    // SqlFunction0
    // Number functions
    asStringNumber(): StringNumberValueSource<TABLE_OR_VIEW, TYPE | string>
    abs(): NumberValueSource<TABLE_OR_VIEW, TYPE>
    ceil(): NumberValueSource<TABLE_OR_VIEW, TYPE>
    floor(): NumberValueSource<TABLE_OR_VIEW, TYPE>
    round(): NumberValueSource<TABLE_OR_VIEW, TYPE>
    exp(): NumberValueSource<TABLE_OR_VIEW, TYPE>
    ln(): NumberValueSource<TABLE_OR_VIEW, TYPE>
    log10(): NumberValueSource<TABLE_OR_VIEW, TYPE>
    sqrt(): NumberValueSource<TABLE_OR_VIEW, TYPE>
    cbrt(): NumberValueSource<TABLE_OR_VIEW, TYPE>
    sign(): NumberValueSource<TABLE_OR_VIEW, TYPE>
    // Trigonometric Functions
    acos(): NumberValueSource<TABLE_OR_VIEW, TYPE>
    asin(): NumberValueSource<TABLE_OR_VIEW, TYPE>
    atan(): NumberValueSource<TABLE_OR_VIEW, TYPE>
    cos(): NumberValueSource<TABLE_OR_VIEW, TYPE>
    cot(): NumberValueSource<TABLE_OR_VIEW, TYPE>
    sin(): NumberValueSource<TABLE_OR_VIEW, TYPE>
    tan(): NumberValueSource<TABLE_OR_VIEW, TYPE>
    // SqlFunction1
    power(value: TYPE): NumberValueSource<TABLE_OR_VIEW, TYPE>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    logn(value: TYPE): NumberValueSource<TABLE_OR_VIEW, TYPE>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    roundn(value: TYPE): NumberValueSource<TABLE_OR_VIEW, TYPE>
    roundn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    roundn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    minValue(value: TYPE): NumberValueSource<TABLE_OR_VIEW, TYPE>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    maxValue(value: TYPE): NumberValueSource<TABLE_OR_VIEW, TYPE>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    // Number operators
    add(value: TYPE): NumberValueSource<TABLE_OR_VIEW, TYPE>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    substract(value: TYPE): NumberValueSource<TABLE_OR_VIEW, TYPE>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    multiply(value: TYPE): NumberValueSource<TABLE_OR_VIEW, TYPE>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    divide(value: TYPE): NumberValueSource<TABLE_OR_VIEW, TYPE>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    mod(value: TYPE): NumberValueSource<TABLE_OR_VIEW, TYPE>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    // Trigonometric Functions
    atan2(value: TYPE): NumberValueSource<TABLE_OR_VIEW, TYPE>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: NumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): NumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    // Redefined methods
    valueWhenNull(value: MandatoryTypeOf<TYPE>): NumberValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, MandatoryTypeOf<TYPE>>): NumberValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): NumberValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    asOptional(): NumberValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
}

export interface StringNumberValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE /*extends number | string | null | undefined = number | string*/> extends ComparableValueSource<TABLE_OR_VIEW, TYPE> {
    [stringNumberValueSourceType]: 'StringNumberValueSource'
    // SqlFunction0
    // Number functions
    abs(): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    ceil(): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    floor(): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    round(): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    exp(): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    ln(): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    log10(): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    sqrt(): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    cbrt(): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    sign(): NumberValueSource<TABLE_OR_VIEW, AsType<TYPE, number>>
    // Trigonometric Functions
    acos(): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    asin(): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    atan(): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    cos(): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    cot(): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    sin(): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    tan(): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    // SqlFunction1
    power(value: TYPE): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    logn(value: TYPE): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    roundn(value: TYPE): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    roundn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    roundn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    minValue(value: TYPE): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    maxValue(value: TYPE): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    // Number operators
    add(value: TYPE): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    substract(value: TYPE): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    multiply(value: TYPE): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    divide(value: TYPE): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    mod(value: TYPE): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    // Trigonometric Functions
    atan2(value: TYPE): StringNumberValueSource<TABLE_OR_VIEW, TYPE>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringNumberValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringNumberValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    // Redefined methods
    valueWhenNull(value: MandatoryTypeOf<TYPE>): StringNumberValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, MandatoryTypeOf<TYPE>>): StringNumberValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringNumberValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    asOptional(): StringNumberValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
}

export interface IntValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE /*extends int | null | undefined = int*/> extends ComparableValueSource<TABLE_OR_VIEW, TYPE> {
    [intValueSourceType]: 'IntValueSource'
    // SqlFunction0
    // Number functions
    asStringInt(): StringIntValueSource<TABLE_OR_VIEW, AsType<TYPE, stringInt>>
    asDouble(): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    asStringDouble(): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    abs(): IntValueSource<TABLE_OR_VIEW, TYPE>
    ceil(): IntValueSource<TABLE_OR_VIEW, TYPE>
    floor(): IntValueSource<TABLE_OR_VIEW, TYPE>
    round(): IntValueSource<TABLE_OR_VIEW, TYPE>
    exp(): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    ln(): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    log10(): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    sqrt(): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    cbrt(): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    sign(): IntValueSource<TABLE_OR_VIEW, TYPE>
    // Trigonometric Functions
    acos(): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    asin(): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    atan(): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    cos(): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    cot(): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    sin(): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    tan(): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    // SqlFunction1
    power(value: TYPE): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, double>>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, double | null | undefined>
    power(value: double): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, double>>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, double | null | undefined>
    logn(value: TYPE): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, double>>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, double | null | undefined>
    logn(value: double): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, double>>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, double | null | undefined>
    roundn(value: TYPE): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    roundn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, double>>
    roundn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, double | null | undefined>
    minValue(value: TYPE): IntValueSource<TABLE_OR_VIEW, TYPE>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): IntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): IntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    minValue(value: double): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, double>>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, double | null | undefined>
    maxValue(value: TYPE): IntValueSource<TABLE_OR_VIEW, TYPE>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): IntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): IntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    maxValue(value: double): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, double>>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, double | null | undefined>
    // Number operators
    add(value: TYPE): IntValueSource<TABLE_OR_VIEW, TYPE>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): IntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): IntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    add(value: double): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, double>>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, double | null | undefined>
    substract(value: TYPE): IntValueSource<TABLE_OR_VIEW, TYPE>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): IntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): IntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    substract(value: double): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, double>>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, double | null | undefined>
    multiply(value: TYPE): IntValueSource<TABLE_OR_VIEW, TYPE>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): IntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): IntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    multiply(value: double): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, double>>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, double | null | undefined>
    divide(value: TYPE): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, double>>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, double | null | undefined>
    divide(value: double): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, double>>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, double | null | undefined>
    mod(value: TYPE): IntValueSource<TABLE_OR_VIEW, TYPE>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): IntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): IntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    mod(value: double): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, double>>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, double | null | undefined>
    // Trigonometric Functions
    atan2(value: TYPE): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, double>>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, double | null | undefined>
    atan2(value: double): DoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, double>>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, double>>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, double | null | undefined>
    // Redefined methods
    valueWhenNull(value: MandatoryTypeOf<TYPE>): IntValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, MandatoryTypeOf<TYPE>>): IntValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): IntValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    asOptional(): IntValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
}

export interface DoubleValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE /*extends double | null | undefined = double*/> extends ComparableValueSource<TABLE_OR_VIEW, TYPE> {
    [doubleValueSourceType]: 'DoubleValueSource'
    // SqlFunction0
    // Number functions
    //asInt(): IntValueSource<TABLE_OR_VIEW, AsType<TYPE, int>> // test function
    asStringDouble(): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    abs(): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    ceil(): IntValueSource<TABLE_OR_VIEW, AsType<TYPE, int>>
    floor(): IntValueSource<TABLE_OR_VIEW, AsType<TYPE, int>>
    round(): IntValueSource<TABLE_OR_VIEW, AsType<TYPE, int>>
    exp(): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    ln(): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    log10(): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    sqrt(): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    cbrt(): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    sign(): IntValueSource<TABLE_OR_VIEW, AsType<TYPE, int>>
    // Trigonometric Functions
    acos(): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    asin(): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    atan(): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    cos(): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    cot(): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    sin(): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    tan(): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    // SqlFunction1
    power(value: int): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    power(value: TYPE): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    logn(value: int): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    logn(value: TYPE): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    roundn(value: int): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    roundn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    roundn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    minValue(value: int): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    minValue(value: TYPE): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    maxValue(value: int): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    maxValue(value: TYPE): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    // Number operators
    add(value: int): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    add(value: TYPE): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    substract(value: int): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    substract(value: TYPE): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    multiply(value: int): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    multiply(value: TYPE): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    divide(value: int): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    divide(value: TYPE): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    mod(value: int): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    mod(value: TYPE): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    // Trigonometric Functions
    atan2(value: int): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: IntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    atan2(value: TYPE): DoubleValueSource<TABLE_OR_VIEW, TYPE>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: DoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    // Redefined methods
    valueWhenNull(value: MandatoryTypeOf<TYPE>): DoubleValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, MandatoryTypeOf<TYPE>>): DoubleValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DoubleValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    asOptional(): DoubleValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
}

export interface StringIntValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE /*extends stringInt | null | undefined = stringInt*/> extends ComparableValueSource<TABLE_OR_VIEW, TYPE> {
    [stringIntValueSourceType]: 'StringIntValueSource'
    // SqlFunction0
    // Number functions
    asStringDouble(): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    abs(): StringIntValueSource<TABLE_OR_VIEW, TYPE>
    ceil(): StringIntValueSource<TABLE_OR_VIEW, TYPE>
    floor(): StringIntValueSource<TABLE_OR_VIEW, TYPE>
    round(): StringIntValueSource<TABLE_OR_VIEW, TYPE>
    exp(): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    ln(): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    log10(): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    sqrt(): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    cbrt(): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    sign(): IntValueSource<TABLE_OR_VIEW, AsType<TYPE, int>>
    // Trigonometric Functions
    acos(): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    asin(): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    atan(): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    cos(): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    cot(): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    sin(): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    tan(): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    // SqlFunction1
    power(value: TYPE): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, stringDouble>>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, stringDouble | null | undefined>
    power(value: stringDouble): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, stringDouble>>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, stringDouble | null | undefined>
    logn(value: TYPE): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, stringDouble>>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, stringDouble | null | undefined>
    logn(value: stringDouble): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, stringDouble>>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, stringDouble | null | undefined>
    roundn(value: TYPE): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    roundn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, stringDouble>>
    roundn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, stringDouble | null | undefined>
    minValue(value: TYPE): StringIntValueSource<TABLE_OR_VIEW, TYPE>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringIntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringIntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    minValue(value: stringDouble): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, stringDouble>>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, stringDouble | null | undefined>
    maxValue(value: TYPE): StringIntValueSource<TABLE_OR_VIEW, TYPE>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringIntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringIntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    maxValue(value: stringDouble): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, stringDouble>>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, stringDouble | null | undefined>
    // Number operators
    add(value: TYPE): StringIntValueSource<TABLE_OR_VIEW, TYPE>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringIntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringIntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    add(value: stringDouble): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, stringDouble>>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, stringDouble | null | undefined>
    substract(value: TYPE): StringIntValueSource<TABLE_OR_VIEW, TYPE>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringIntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringIntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    substract(value: stringDouble): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, stringDouble>>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, stringDouble | null | undefined>
    multiply(value: TYPE): StringIntValueSource<TABLE_OR_VIEW, TYPE>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringIntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringIntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    multiply(value: stringDouble): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, stringDouble>>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, stringDouble | null | undefined>
    divide(value: TYPE): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, stringDouble>>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, stringDouble | null | undefined>
    divide(value: stringDouble): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, stringDouble>>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, stringDouble | null | undefined>
    mod(value: TYPE): StringIntValueSource<TABLE_OR_VIEW, TYPE>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringIntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringIntValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    mod(value: stringDouble): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, stringDouble>>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, stringDouble | null | undefined>
    // Trigonometric Functions
    atan2(value: TYPE): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, stringDouble>>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, stringDouble | null | undefined>
    atan2(value: stringDouble): StringDoubleValueSource<TABLE_OR_VIEW, AsType<TYPE, stringDouble>>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, AsType<TYPE, stringDouble>>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, stringDouble | null | undefined>
    // Redefined methods
    valueWhenNull(value: MandatoryTypeOf<TYPE>): StringIntValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, MandatoryTypeOf<TYPE>>): StringIntValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringIntValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    asOptional(): StringIntValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
}

export interface StringDoubleValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE /*extends stringDouble | null | undefined = stringDouble*/> extends ComparableValueSource<TABLE_OR_VIEW, TYPE> {
    [stringDoubleValueSourceType]: 'StringDoubleValueSource'
    // SqlFunction0
    // Number functions
    //asInt(): StringIntValueSource<TABLE_OR_VIEW, StringIntTypeOf<TYPE>> // test function
    abs(): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    ceil(): StringIntValueSource<TABLE_OR_VIEW, AsType<TYPE, stringInt>>
    floor(): StringIntValueSource<TABLE_OR_VIEW, AsType<TYPE, stringInt>>
    round(): StringIntValueSource<TABLE_OR_VIEW, AsType<TYPE, stringInt>>
    exp(): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    ln(): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    log10(): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    sqrt(): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    cbrt(): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    sign(): IntValueSource<TABLE_OR_VIEW, AsType<TYPE, int>>
    // Trigonometric Functions
    acos(): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    asin(): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    atan(): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    cos(): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    cot(): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    sin(): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    tan(): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    // SqlFunction1
    power(value: stringInt): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    power(value: TYPE): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    power<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    logn(value: stringInt): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    logn(value: TYPE): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    logn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    roundn(value: stringInt): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    roundn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    roundn<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    minValue(value: stringInt): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    minValue(value: TYPE): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    minValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    maxValue(value: stringInt): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    maxValue(value: TYPE): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    maxValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    // Number operators
    add(value: stringInt): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    add(value: TYPE): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    add<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    substract(value: stringInt): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    substract(value: TYPE): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    substract<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    multiply(value: stringInt): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    multiply(value: TYPE): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    multiply<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    divide(value: stringInt): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    divide(value: TYPE): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    divide<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    mod(value: stringInt): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    mod(value: TYPE): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    mod<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    // Trigonometric Functions
    atan2(value: stringInt): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringIntValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    atan2(value: TYPE): StringDoubleValueSource<TABLE_OR_VIEW, TYPE>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    atan2<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringDoubleValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    // Redefined methods
    valueWhenNull(value: MandatoryTypeOf<TYPE>): StringDoubleValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, MandatoryTypeOf<TYPE>>): StringDoubleValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringDoubleValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    asOptional(): StringDoubleValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
}

export interface StringValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE /*extends string | null | undefined = string*/> extends ComparableValueSource<TABLE_OR_VIEW, TYPE> {
    [stringValueSourceType]: 'StringValueSource'
    // SqlComparator 1
    equalsInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    equalsInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    equalsInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    equalsInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notEqualsInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notEqualsInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notEqualsInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notEqualsInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    likeIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    like(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    like<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    like<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notLikeIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notLike(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notLike<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notLike<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    likeInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    likeInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    likeInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    likeInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notLikeInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notLikeInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notLikeInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notLikeInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    startWithIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    startWith(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    startWith<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    startWith<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notStartWithIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notStartWith(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notStartWith<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notStartWith<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    endWithIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    endWith(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    endWith<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    endWith<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notEndWithIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notEndWith(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notEndWith<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notEndWith<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    startWithInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    startWithInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    startWithInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    startWithInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notStartWithInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notStartWithInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notStartWithInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notStartWithInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    endWithInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    endWithInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    endWithInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    endWithInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notEndWithInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notEndWithInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notEndWithInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notEndWithInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    containsIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    contains(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    contains<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    contains<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notContainsIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notContains(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notContains<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notContains<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    containsInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    containsInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    containsInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    containsInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notContainsInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notContainsInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notContainsInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notContainsInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    // SqlFunction0
    lower(): StringValueSource<TABLE_OR_VIEW, TYPE>
    upper(): StringValueSource<TABLE_OR_VIEW, TYPE>
    length(): NumberValueSource<TABLE_OR_VIEW, number>
    trim(): StringValueSource<TABLE_OR_VIEW, TYPE>
    ltrim(): StringValueSource<TABLE_OR_VIEW, TYPE>
    rtrim(): StringValueSource<TABLE_OR_VIEW, TYPE>
    reverse(): StringValueSource<TABLE_OR_VIEW, TYPE>
    // SqlFunction1
    concatIfValue(value: TYPE | null | undefined): StringValueSource<TABLE_OR_VIEW, TYPE>
    concat(value: TYPE): StringValueSource<TABLE_OR_VIEW, TYPE>
    concat(value: TYPE | null | undefined): StringValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    concat<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringValueSource<TABLE_OR_VIEW2, TYPE>): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    concat<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: StringValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    substringToEnd(start: number): StringValueSource<TABLE_OR_VIEW, TYPE>
    substringToEnd<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(start: NumberValueSource<TABLE_OR_VIEW2, number>): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    substringToEnd<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(start: NumberValueSource<TABLE_OR_VIEW2, number | null | undefined>): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    // SqlFunction2
    substring(start: number, end: number): StringValueSource<TABLE_OR_VIEW, TYPE>
    substring<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(start: number, end: NumberValueSource<TABLE_OR_VIEW2, number>): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    substring<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(start: number, end: NumberValueSource<TABLE_OR_VIEW2, number | null | undefined>): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    substring<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(start: NumberValueSource<TABLE_OR_VIEW2, number>, end: number): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    substring<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(start: NumberValueSource<TABLE_OR_VIEW2, number | null | undefined>, end: number): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    substring<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(start: NumberValueSource<TABLE_OR_VIEW2, number>, end: NumberValueSource<TABLE_OR_VIEW3, number>): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, TYPE>
    substring<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(start: NumberValueSource<TABLE_OR_VIEW2, number>, end: NumberValueSource<TABLE_OR_VIEW3, number | null | undefined>): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, TYPE| null | undefined>
    substring<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(start: NumberValueSource<TABLE_OR_VIEW2, number | null | undefined>, end: NumberValueSource<TABLE_OR_VIEW3, number>): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, TYPE| null | undefined>
    substring<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(start: NumberValueSource<TABLE_OR_VIEW2, number | null | undefined>, end: NumberValueSource<TABLE_OR_VIEW3, number | null | undefined>): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, TYPE| null | undefined>
    replaceIfValue(findString: TYPE | null | undefined, replaceWith: TYPE | null | undefined): StringValueSource<TABLE_OR_VIEW, TYPE>
    replaceIfValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(findString: TYPE | null | undefined, replaceWith: StringValueSource<TABLE_OR_VIEW2, TYPE>): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    replaceIfValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(findString: TYPE | null | undefined, replaceWith: StringValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    replaceIfValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(findString: StringValueSource<TABLE_OR_VIEW2, TYPE>, replaceWith: TYPE | null | undefined): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    replaceIfValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(findString: StringValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>, replaceWith: TYPE | null | undefined): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    replace(findString: TYPE, replaceWith: TYPE): StringValueSource<TABLE_OR_VIEW, TYPE>
    replace<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(findString: TYPE, replaceWith: StringValueSource<TABLE_OR_VIEW2, TYPE>): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    replace<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(findString: TYPE, replaceWith: StringValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    replace<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(findString: StringValueSource<TABLE_OR_VIEW2, TYPE>, replaceWith: TYPE): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    replace<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(findString: StringValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>, replaceWith: TYPE): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    replace<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(findString: StringValueSource<TABLE_OR_VIEW2, TYPE>, replaceWith: StringValueSource<TABLE_OR_VIEW3, TYPE>): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, TYPE>
    replace<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(findString: StringValueSource<TABLE_OR_VIEW2, TYPE>, replaceWith: StringValueSource<TABLE_OR_VIEW3, TYPE | null | undefined>): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, TYPE | null | undefined>
    replace<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(findString: StringValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>, replaceWith: StringValueSource<TABLE_OR_VIEW3, TYPE>): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, TYPE | null | undefined>
    replace<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(findString: StringValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>, replaceWith: StringValueSource<TABLE_OR_VIEW3, TYPE | null | undefined>): StringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, TYPE | null | undefined>
    // Redefined methods
    valueWhenNull(value: MandatoryTypeOf<TYPE>): StringValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, MandatoryTypeOf<TYPE>>): StringValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): StringValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    asOptional(): StringValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
}

export interface TypeSafeStringValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE /*extends string | null | undefined = string*/> extends ComparableValueSource<TABLE_OR_VIEW, TYPE> {
    [typeSafeStringValueSourceType]: 'TypeSafeStringValueSource'
    // SqlComparator 1
    //asString(): TypeSafeStringValueSource<TABLE_OR_VIEW, TYPE> // test function
    equalsInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    equalsInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    equalsInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    equalsInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notEqualsInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notEqualsInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notEqualsInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notEqualsInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    likeIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    like(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    like<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    like<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notLikeIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notLike(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notLike<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notLike<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    likeInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    likeInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    likeInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    likeInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notLikeInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notLikeInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notLikeInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notLikeInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    startWithIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    startWith(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    startWith<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    startWith<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notStartWithIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notStartWith(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notStartWith<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notStartWith<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    endWithIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    endWith(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    endWith<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    endWith<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notEndWithIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notEndWith(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notEndWith<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notEndWith<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    startWithInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    startWithInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    startWithInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    startWithInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notStartWithInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notStartWithInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notStartWithInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notStartWithInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    endWithInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    endWithInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    endWithInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    endWithInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notEndWithInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notEndWithInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notEndWithInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notEndWithInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    containsIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    contains(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    contains<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    contains<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notContainsIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notContains(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notContains<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notContains<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    containsInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    containsInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    containsInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    containsInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    notContainsInsensitiveIfValue(value: TYPE | null | undefined): IfValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notContainsInsensitive(value: TYPE): BooleanValueSource<TABLE_OR_VIEW, BooleanOrNullOf<TYPE>>
    notContainsInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, BooleanOrNullOf<TYPE>>
    notContainsInsensitive<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): BooleanValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, boolean | null | undefined>
    // SqlFunction0
    lower(): TypeSafeStringValueSource<TABLE_OR_VIEW, TYPE>
    upper(): TypeSafeStringValueSource<TABLE_OR_VIEW, TYPE>
    length(): IntValueSource<TABLE_OR_VIEW, int>
    trim(): TypeSafeStringValueSource<TABLE_OR_VIEW, TYPE>
    ltrim(): TypeSafeStringValueSource<TABLE_OR_VIEW, TYPE>
    rtrim(): TypeSafeStringValueSource<TABLE_OR_VIEW, TYPE>
    reverse(): TypeSafeStringValueSource<TABLE_OR_VIEW, TYPE>
    // SqlFunction1
    concatIfValue(value: TYPE | null | undefined): TypeSafeStringValueSource<TABLE_OR_VIEW, TYPE>
    concat(value: TYPE): TypeSafeStringValueSource<TABLE_OR_VIEW, TYPE>
    concat(value: TYPE | null | undefined): TypeSafeStringValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    concat<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: TypeSafeStringValueSource<TABLE_OR_VIEW2, TYPE>): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    concat<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: TypeSafeStringValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    substringToEnd(start: int): TypeSafeStringValueSource<TABLE_OR_VIEW, TYPE>
    substringToEnd<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(start: IntValueSource<TABLE_OR_VIEW2, int>): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    substringToEnd<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(start: IntValueSource<TABLE_OR_VIEW2, int | null | undefined>): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    // SqlFunction2
    substring(start: int, end: int): TypeSafeStringValueSource<TABLE_OR_VIEW, TYPE>
    substring<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(start: int, end: IntValueSource<TABLE_OR_VIEW2, int>): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    substring<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(start: int, end: IntValueSource<TABLE_OR_VIEW2, int | null | undefined>): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    substring<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(start: IntValueSource<TABLE_OR_VIEW2, int>, end: int): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    substring<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(start: IntValueSource<TABLE_OR_VIEW2, int | null | undefined>, end: int): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    substring<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(start: IntValueSource<TABLE_OR_VIEW2, int>, end: IntValueSource<TABLE_OR_VIEW3, int>): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, TYPE>
    substring<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(start: IntValueSource<TABLE_OR_VIEW2, int>, end: IntValueSource<TABLE_OR_VIEW3, int | null | undefined>): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, TYPE| null | undefined>
    substring<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(start: IntValueSource<TABLE_OR_VIEW2, int | null | undefined>, end: IntValueSource<TABLE_OR_VIEW3, int>): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, TYPE| null | undefined>
    substring<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(start: IntValueSource<TABLE_OR_VIEW2, int | null | undefined>, end: IntValueSource<TABLE_OR_VIEW3, int | null | undefined>): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, TYPE| null | undefined>
    replaceIfValue(findString: TYPE | null | undefined, replaceWith: TYPE | null | undefined): TypeSafeStringValueSource<TABLE_OR_VIEW, TYPE>
    replaceIfValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(findString: TYPE | null | undefined, replaceWith: TypeSafeStringValueSource<TABLE_OR_VIEW2, TYPE>): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    replaceIfValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(findString: TYPE | null | undefined, replaceWith: TypeSafeStringValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    replaceIfValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(findString: TypeSafeStringValueSource<TABLE_OR_VIEW2, TYPE>, replaceWith: TYPE | null | undefined): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    replaceIfValue<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(findString: TypeSafeStringValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>, replaceWith: TYPE | null | undefined): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    replace(findString: TYPE, replaceWith: TYPE): TypeSafeStringValueSource<TABLE_OR_VIEW, TYPE>
    replace<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(findString: TYPE, replaceWith: TypeSafeStringValueSource<TABLE_OR_VIEW2, TYPE>): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    replace<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(findString: TYPE, replaceWith: TypeSafeStringValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    replace<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(findString: TypeSafeStringValueSource<TABLE_OR_VIEW2, TYPE>, replaceWith: TYPE): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE>
    replace<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(findString: TypeSafeStringValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>, replaceWith: TYPE): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2, TYPE | null | undefined>
    replace<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(findString: TypeSafeStringValueSource<TABLE_OR_VIEW2, TYPE>, replaceWith: TypeSafeStringValueSource<TABLE_OR_VIEW3, TYPE>): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, TYPE>
    replace<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(findString: TypeSafeStringValueSource<TABLE_OR_VIEW2, TYPE>, replaceWith: TypeSafeStringValueSource<TABLE_OR_VIEW3, TYPE | null | undefined>): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, TYPE | null | undefined>
    replace<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(findString: TypeSafeStringValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>, replaceWith: TypeSafeStringValueSource<TABLE_OR_VIEW3, TYPE>): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, TYPE | null | undefined>
    replace<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>, TABLE_OR_VIEW3 extends TableOrViewRef<this[typeof database]>>(findString: TypeSafeStringValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>, replaceWith: TypeSafeStringValueSource<TABLE_OR_VIEW3, TYPE | null | undefined>): TypeSafeStringValueSource<TABLE_OR_VIEW | TABLE_OR_VIEW2 | TABLE_OR_VIEW3, TYPE | null | undefined>
    // Redefined methods
    valueWhenNull(value: MandatoryTypeOf<TYPE>): TypeSafeStringValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, MandatoryTypeOf<TYPE>>): TypeSafeStringValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): TypeSafeStringValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    asOptional(): TypeSafeStringValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
}

export interface DateValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE /*extends Date | null | undefined = Date*/> extends ComparableValueSource<TABLE_OR_VIEW, TYPE> {
    [dateValueSourceType]: 'DateValueSource'
    /** Gets the year */
    getFullYear(): NumberValueSource<TABLE_OR_VIEW, number>
    /** Gets the month (value between 0 to 11)*/
    getMonth(): NumberValueSource<TABLE_OR_VIEW, number>
    /** Gets the day-of-the-month */
    getDate(): NumberValueSource<TABLE_OR_VIEW, number>
    /** Gets the day of the week (0 represents Sunday) */
    getDay(): NumberValueSource<TABLE_OR_VIEW, number>
    // Redefined methods
    valueWhenNull(value: MandatoryTypeOf<TYPE>): DateValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, MandatoryTypeOf<TYPE>>): DateValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DateValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    asOptional(): DateValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
}

export interface TimeValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE /*extends Date | null | undefined = Date*/> extends ComparableValueSource<TABLE_OR_VIEW, TYPE> {
    [timeValueSourceType]: 'TimeValueSource'
    /** Gets the hours */
    getHours(): NumberValueSource<TABLE_OR_VIEW, number>
    /** Gets the minutes */
    getMinutes(): NumberValueSource<TABLE_OR_VIEW, number>
    /** Gets the seconds */
    getSeconds(): NumberValueSource<TABLE_OR_VIEW, number>
    /** Gets the milliseconds */
    getMilliseconds(): NumberValueSource<TABLE_OR_VIEW, number>
    // Redefined methods
    valueWhenNull(value: MandatoryTypeOf<TYPE>): TimeValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, MandatoryTypeOf<TYPE>>): TimeValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): TimeValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    asOptional(): TimeValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
}

export interface DateTimeValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE /*extends Date | null | undefined = Date*/> extends ComparableValueSource<TABLE_OR_VIEW, TYPE> {
    [dateTimeValueSourceType]: 'DateTimeValueSource'
    /** Gets the year */
    getFullYear(): NumberValueSource<TABLE_OR_VIEW, number>
    /** Gets the month (value between 0 to 11)*/
    getMonth(): NumberValueSource<TABLE_OR_VIEW, number>
    /** Gets the day-of-the-month */
    getDate(): NumberValueSource<TABLE_OR_VIEW, number>
    /** Gets the day of the week (0 represents Sunday) */
    getDay(): NumberValueSource<TABLE_OR_VIEW, number>
    /** Gets the hours */
    getHours(): NumberValueSource<TABLE_OR_VIEW, number>
    /** Gets the minutes */
    getMinutes(): NumberValueSource<TABLE_OR_VIEW, number>
    /** Gets the seconds */
    getSeconds(): NumberValueSource<TABLE_OR_VIEW, number>
    /** Gets the milliseconds */
    getMilliseconds(): NumberValueSource<TABLE_OR_VIEW, number>
    /** Gets the time value in milliseconds */
    getTime(): NumberValueSource<TABLE_OR_VIEW, number>
    // Redefined methods
    valueWhenNull(value: MandatoryTypeOf<TYPE>): DateTimeValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, MandatoryTypeOf<TYPE>>): DateTimeValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): DateTimeValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    asOptional(): DateTimeValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
}

export interface LocalDateValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE /*extends LocalDate | null | undefined = LocalDate*/> extends ComparableValueSource<TABLE_OR_VIEW, TYPE> {
    [localDateValueSourceType]: 'LocalDateValueSource'
    /** Gets the year */
    getFullYear(): IntValueSource<TABLE_OR_VIEW, int>
    /** Gets the month (value between 0 to 11)*/
    getMonth(): IntValueSource<TABLE_OR_VIEW, int>
    /** Gets the day-of-the-month */
    getDate(): IntValueSource<TABLE_OR_VIEW, int>
    /** Gets the day of the week (0 represents Sunday) */
    getDay(): IntValueSource<TABLE_OR_VIEW, int>
    // Redefined methods
    valueWhenNull(value: MandatoryTypeOf<TYPE>): LocalDateValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, MandatoryTypeOf<TYPE>>): LocalDateValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): LocalDateValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    asOptional(): LocalDateValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
}

export interface LocalTimeValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE /*extends LocalTime | null | undefined = LocalTime*/> extends ComparableValueSource<TABLE_OR_VIEW, TYPE> {
    [localTimeValueSourceType]: 'LocalTimeValueSource'
    /** Gets the hours */
    getHours(): IntValueSource<TABLE_OR_VIEW, int>
    /** Gets the minutes */
    getMinutes(): IntValueSource<TABLE_OR_VIEW, int>
    /** Gets the seconds */
    getSeconds(): IntValueSource<TABLE_OR_VIEW, int>
    /** Gets the milliseconds */
    getMilliseconds(): IntValueSource<TABLE_OR_VIEW, int>
    // Redefined methods
    valueWhenNull(value: MandatoryTypeOf<TYPE>): LocalTimeValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, MandatoryTypeOf<TYPE>>): LocalTimeValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): LocalTimeValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    asOptional(): LocalTimeValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
}

export interface LocalDateTimeValueSource<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE /*extends LocalDateTime | null | undefined = LocalDateTime*/> extends ComparableValueSource<TABLE_OR_VIEW, TYPE> {
    [localDateTimeValueSourceType]: 'LocalDateTimeValueSource'
    /** Gets the year */
    getFullYear(): IntValueSource<TABLE_OR_VIEW, int>
    /** Gets the month (value between 0 to 11)*/
    getMonth(): IntValueSource<TABLE_OR_VIEW, int>
    /** Gets the day-of-the-month */
    getDate(): IntValueSource<TABLE_OR_VIEW, int>
    /** Gets the day of the week (0 represents Sunday) */
    getDay(): IntValueSource<TABLE_OR_VIEW, int>
    /** Gets the hours */
    getHours(): IntValueSource<TABLE_OR_VIEW, int>
    /** Gets the minutes */
    getMinutes(): IntValueSource<TABLE_OR_VIEW, int>
    /** Gets the seconds */
    getSeconds(): IntValueSource<TABLE_OR_VIEW, int>
    /** Gets the milliseconds */
    getMilliseconds(): IntValueSource<TABLE_OR_VIEW, int>
    /** Gets the time value in milliseconds. */
    getTime(): IntValueSource<TABLE_OR_VIEW, int>
    // Redefined methods
    valueWhenNull(value: MandatoryTypeOf<TYPE>): LocalDateTimeValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, MandatoryTypeOf<TYPE>>): LocalDateTimeValueSource<TABLE_OR_VIEW, MandatoryTypeOf<TYPE>>
    valueWhenNull<TABLE_OR_VIEW2 extends TableOrViewRef<this[typeof database]>>(value: ValueSource<TABLE_OR_VIEW2, TYPE | null | undefined>): LocalDateTimeValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
    asOptional(): LocalDateTimeValueSource<TABLE_OR_VIEW, TYPE | null | undefined>
}

export type ColumnsOf<TYPE extends ITableOrView<any>> = ({ [K in keyof TYPE]-?: TYPE[K] extends ValueSource<TYPE[typeof tableOrViewRef], any> ? K : never })[keyof TYPE]

export type TypeOfColumn<TABLE_OR_VIEW extends ITableOrView<any>, K extends ColumnsOf<TABLE_OR_VIEW>> =
    TABLE_OR_VIEW[K] extends ValueSource<TABLE_OR_VIEW[typeof tableOrViewRef], infer Q> ? Q
    : never

export type InputTypeOfColumn<TYPE extends ITableOrView<any>, K extends ColumnsOf<TYPE>> =
    TYPE[K] extends ValueSource<TYPE[typeof tableOrViewRef], infer Q> ?
    (TYPE[K] extends ColumnWithDefaultValue ? (
        Q | ValueSource<TYPE[typeof tableOrViewRef], Q> | Default
    ) : (
        Q | ValueSource<TYPE[typeof tableOrViewRef], Q>
    ))
    : never

export type BooleanOrNullOf<T> = T extends null | undefined ? T : boolean
export type StringOrNullOf<T> = T extends null | undefined ? T : string

export type RemapValueSourceType<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE> =
    TYPE extends ValueSource<any, infer T> ? (
        TYPE extends BooleanValueSource<any, any> ? BooleanValueSource<TABLE_OR_VIEW, T> :
        TYPE extends StringIntValueSource<any, any> ? StringIntValueSource<TABLE_OR_VIEW, T> :
        TYPE extends IntValueSource<any, any> ? IntValueSource<TABLE_OR_VIEW, T> :
        TYPE extends StringDoubleValueSource<any, any> ? StringDoubleValueSource<TABLE_OR_VIEW, T> :
        TYPE extends DoubleValueSource<any, any> ? DoubleValueSource<TABLE_OR_VIEW, T> :
        TYPE extends StringNumberValueSource<any, any> ? StringNumberValueSource<TABLE_OR_VIEW, T> :
        TYPE extends NumberValueSource<any, any> ? NumberValueSource<TABLE_OR_VIEW, T> :
        TYPE extends TypeSafeStringValueSource<any, any> ? TypeSafeStringValueSource<TABLE_OR_VIEW, T> :
        TYPE extends StringValueSource<any, any> ? StringValueSource<TABLE_OR_VIEW, T> :
        TYPE extends LocalDateTimeValueSource<any, any> ? LocalDateTimeValueSource<TABLE_OR_VIEW, T> :
        TYPE extends DateTimeValueSource<any, any> ? DateTimeValueSource<TABLE_OR_VIEW, T> :
        TYPE extends LocalDateValueSource<any, any> ? LocalDateValueSource<TABLE_OR_VIEW, T> :
        TYPE extends DateValueSource<any, any> ? DateValueSource<TABLE_OR_VIEW, T> :
        TYPE extends LocalTimeValueSource<any, any> ? LocalTimeValueSource<TABLE_OR_VIEW, T> :
        TYPE extends TimeValueSource<any, any> ? TimeValueSource<TABLE_OR_VIEW, T> :
        TYPE extends ComparableValueSource<any, any> ? ComparableValueSource<TABLE_OR_VIEW, T> :
        TYPE extends EqualableValueSource<any, any> ? EqualableValueSource<TABLE_OR_VIEW, T> :
        TYPE extends NullableValueSource<any, any> ? NullableValueSource<TABLE_OR_VIEW, T> :
        TYPE extends ValueSource<any, any> ? NullableValueSource<TABLE_OR_VIEW, T> :
        never
    ): never

export type RemapValueSourceTypeAsOptional<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE> =
    TYPE extends ValueSource<any, infer T> ? (
        TYPE extends BooleanValueSource<any, any> ? BooleanValueSource<TABLE_OR_VIEW, T | null | undefined> :
        TYPE extends StringIntValueSource<any, any> ? StringIntValueSource<TABLE_OR_VIEW, T | null | undefined> :
        TYPE extends IntValueSource<any, any> ? IntValueSource<TABLE_OR_VIEW, T | null | undefined> :
        TYPE extends StringDoubleValueSource<any, any> ? StringDoubleValueSource<TABLE_OR_VIEW, T | null | undefined> :
        TYPE extends DoubleValueSource<any, any> ? DoubleValueSource<TABLE_OR_VIEW, T | null | undefined> :
        TYPE extends StringNumberValueSource<any, any> ? StringNumberValueSource<TABLE_OR_VIEW, T | null | undefined> :
        TYPE extends NumberValueSource<any, any> ? NumberValueSource<TABLE_OR_VIEW, T | null | undefined> :
        TYPE extends TypeSafeStringValueSource<any, any> ? TypeSafeStringValueSource<TABLE_OR_VIEW, T | null | undefined> :
        TYPE extends StringValueSource<any, any> ? StringValueSource<TABLE_OR_VIEW, T | null | undefined> :
        TYPE extends LocalDateTimeValueSource<any, any> ? LocalDateTimeValueSource<TABLE_OR_VIEW, T | null | undefined> :
        TYPE extends DateTimeValueSource<any, any> ? DateTimeValueSource<TABLE_OR_VIEW, T | null | undefined> :
        TYPE extends LocalDateValueSource<any, any> ? LocalDateValueSource<TABLE_OR_VIEW, T | null | undefined> :
        TYPE extends DateValueSource<any, any> ? DateValueSource<TABLE_OR_VIEW, T | null | undefined> :
        TYPE extends LocalTimeValueSource<any, any> ? LocalTimeValueSource<TABLE_OR_VIEW, T | null | undefined> :
        TYPE extends TimeValueSource<any, any> ? TimeValueSource<TABLE_OR_VIEW, T | null | undefined> :
        TYPE extends ComparableValueSource<any, any> ? ComparableValueSource<TABLE_OR_VIEW, T | null | undefined> :
        TYPE extends EqualableValueSource<any, any> ? EqualableValueSource<TABLE_OR_VIEW, T | null | undefined> :
        TYPE extends NullableValueSource<any, any> ? NullableValueSource<TABLE_OR_VIEW, T | null | undefined> :
        TYPE extends ValueSource<any, any> ? NullableValueSource<TABLE_OR_VIEW, T | null | undefined> :
        never
    ): never

export type RemapValueSourceTypeAsMandatory<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, TYPE> =
    TYPE extends ValueSource<any, infer T> ? (
        TYPE extends BooleanValueSource<any, any> ? BooleanValueSource<TABLE_OR_VIEW, MandatoryTypeOf<T>> :
        TYPE extends StringIntValueSource<any, any> ? StringIntValueSource<TABLE_OR_VIEW, MandatoryTypeOf<T>> :
        TYPE extends IntValueSource<any, any> ? IntValueSource<TABLE_OR_VIEW, MandatoryTypeOf<T>> :
        TYPE extends StringDoubleValueSource<any, any> ? StringDoubleValueSource<TABLE_OR_VIEW, MandatoryTypeOf<T>> :
        TYPE extends DoubleValueSource<any, any> ? DoubleValueSource<TABLE_OR_VIEW, MandatoryTypeOf<T>> :
        TYPE extends StringNumberValueSource<any, any> ? StringNumberValueSource<TABLE_OR_VIEW, MandatoryTypeOf<T>> :
        TYPE extends NumberValueSource<any, any> ? NumberValueSource<TABLE_OR_VIEW, MandatoryTypeOf<T>> :
        TYPE extends TypeSafeStringValueSource<any, any> ? TypeSafeStringValueSource<TABLE_OR_VIEW, MandatoryTypeOf<T>> :
        TYPE extends StringValueSource<any, any> ? StringValueSource<TABLE_OR_VIEW, MandatoryTypeOf<T>> :
        TYPE extends LocalDateTimeValueSource<any, any> ? LocalDateTimeValueSource<TABLE_OR_VIEW, MandatoryTypeOf<T>> :
        TYPE extends DateTimeValueSource<any, any> ? DateTimeValueSource<TABLE_OR_VIEW, MandatoryTypeOf<T>> :
        TYPE extends LocalDateValueSource<any, any> ? LocalDateValueSource<TABLE_OR_VIEW, MandatoryTypeOf<T>> :
        TYPE extends DateValueSource<any, any> ? DateValueSource<TABLE_OR_VIEW, MandatoryTypeOf<T>> :
        TYPE extends LocalTimeValueSource<any, any> ? LocalTimeValueSource<TABLE_OR_VIEW, MandatoryTypeOf<T>> :
        TYPE extends TimeValueSource<any, any> ? TimeValueSource<TABLE_OR_VIEW, MandatoryTypeOf<T>> :
        TYPE extends ComparableValueSource<any, any> ? ComparableValueSource<TABLE_OR_VIEW, MandatoryTypeOf<T>> :
        TYPE extends EqualableValueSource<any, any> ? EqualableValueSource<TABLE_OR_VIEW, MandatoryTypeOf<T>> :
        TYPE extends NullableValueSource<any, any> ? NullableValueSource<TABLE_OR_VIEW, MandatoryTypeOf<T>> :
        TYPE extends ValueSource<any, any> ? NullableValueSource<TABLE_OR_VIEW, MandatoryTypeOf<T>> :
        never
    ): never

export type MandatoryTypeOf<T> = T extends null | undefined ? never : T
export type OptionalTypeOf<T> = T extends null ? null : T extends undefined ? undefined : never
export type AsType<T, TYPE> = TYPE | OptionalTypeOf<T>

export type ArgumentType = 'boolean' | 'stringInt' | 'int' | 'stringDouble' | 'double' | 'string' | 'localDateTime' | 'localDate' | 'localTime' | 'customComparable' | 'enum' | 'custom'
export type ArgumentRequire = 'required' | 'optional'
export class Argument<T extends ArgumentType, REQUIRED extends ArgumentRequire, TYPE> {
    readonly type: T
    readonly typeName: string
    readonly required: REQUIRED
    readonly adapter?: TypeAdapter
    [valueType]: TYPE
    constructor (argumentType: T, typeName: string, required: REQUIRED, adapter?: TypeAdapter,) {
        this.type = argumentType
        this.typeName = typeName
        this.required = required
        this.adapter = adapter
    }
}

export type TypeOf<R extends ArgumentRequire, T> = R extends 'required' ? T : (T | null | undefined)
export type TypeOfArgument<ARG> = ARG extends Argument<any, any, infer T> ? T : never

export type MapArgumentToTypeSafe<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, ARG> =
    ARG extends Argument<infer TYPE, infer REQUIRED, infer T> ? (
        TYPE extends 'boolean' ? BooleanValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'stringInt' ? StringIntValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'int' ? IntValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'stringDouble' ? StringDoubleValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'double' ? DoubleValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'string' ? TypeSafeStringValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'localDateTime' ? LocalDateTimeValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'localDate' ? LocalDateValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'localTime' ? LocalTimeValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'customComparable'? ComparableValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'enum' ? EqualableValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'custom' ? EqualableValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        never
    ): never

export type MapArgumentToTypeUnsafe<TABLE_OR_VIEW extends TableOrViewRef<AnyDB>, ARG> =
    ARG extends Argument<infer TYPE, infer REQUIRED, infer T> ? (
        TYPE extends 'boolean' ? BooleanValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'stringInt' ? StringNumberValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'int' ? NumberValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'stringDouble' ? StringDoubleValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'double' ? NumberValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'string' ? StringValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'localDateTime' ? DateTimeValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'localDate' ? DateValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'localTime' ? TimeValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'customComparable' ? ComparableValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'enum' ? EqualableValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        TYPE extends 'custom' ? EqualableValueSource<TABLE_OR_VIEW, TypeOf<REQUIRED, T>> :
        never
    ): never