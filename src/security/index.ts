import {ITokenSecurity} from './impl/ITokenSecurity';

export const tokenSecurity: ITokenSecurity = new ITokenSecurity('this_is_a_jwt_secret', 'Authorization', 'Bearer ', [
    '/login',
    '/proxy/service/common/**',
]);

export * from './impl/ITokenSecurity';
export * from './Security';
export * from './SercurityEntity';
