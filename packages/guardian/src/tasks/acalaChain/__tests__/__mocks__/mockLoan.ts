import { of } from 'rxjs';
import { TypeRegistry } from '@polkadot/types';
import { Vec } from '@polkadot/types/codec';
import { types } from '@acala-network/types';
import { customTypes } from '../../../../customTypes';
import { observable } from 'mobx';

const register = new TypeRegistry();
register.register(types);
register.register(customTypes);

const MockApiRx = of({
  consts: {
    cdpTreasury: { getStableCurrencyId: 'AUSD' },
    prices: { stableCurrencyFixedPrice: 1e18 },
    cdpEngine: {
      collateralCurrencyIds: register.createType('Vec<CurrencyId>', ['DOT', 'XBTC', 'LDOT']),
    },
  },
});

const MockStorage = {
  loans: {
    positions: jest.fn(() =>
      register.createType('Position', { debit: '1995229380509623964735', collateral: '1000000000000000000' })
    ),
  },
  cdpEngine: {
    debitExchangeRate: jest.fn(() => register.createType('Option<ExchangeRate>', '100242367706398103')),
  },
  oracle: {
    rawValues: {
      allEntries: jest.fn(() =>
        observable.map({
          0: observable.map({
            DOT: register.createType('Option<TimestampedValue>', { value: '300000000000000000000' }),
          }),
        })
      ),
    },
  },
};

jest.mock('@open-web3/api-mobx', () => ({
  createStorage: jest.fn(() => MockStorage),
}));

jest.mock('@polkadot/api', () => ({
  WsProvider: jest.fn(() => {}),
  ApiPromise: { create: jest.fn() },
  ApiRx: { create: jest.fn(() => MockApiRx) },
}));
