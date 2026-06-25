import * as intl from '../../node_modules/@formatjs/intl/index.js';

type FormatJsIntl = typeof import('@formatjs/intl');

const formatjsIntl = intl as unknown as FormatJsIntl;

export const createIntlCache = formatjsIntl.createIntlCache;
export const filterProps = formatjsIntl.filterProps;
export const DEFAULT_INTL_CONFIG = formatjsIntl.DEFAULT_INTL_CONFIG;
export const createFormatters = formatjsIntl.createFormatters;
export const getNamedFormat = formatjsIntl.getNamedFormat;
export const formatMessage = formatjsIntl.formatMessage;
export const createIntl = formatjsIntl.createIntl;
export const UnsupportedFormatterError = formatjsIntl.UnsupportedFormatterError;
export const InvalidConfigError = formatjsIntl.InvalidConfigError;
export const MissingDataError = formatjsIntl.MissingDataError;
export const MessageFormatError = formatjsIntl.MessageFormatError;
export const MissingTranslationError = formatjsIntl.MissingTranslationError;
export const IntlErrorCode = formatjsIntl.IntlErrorCode;
export const IntlError = formatjsIntl.IntlError;
