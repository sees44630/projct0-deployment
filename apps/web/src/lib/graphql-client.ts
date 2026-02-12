// GraphQL Client (Isomorphic - safe for build and client)

import { GraphQLClient } from 'graphql-request';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql';

export const gqlClient = new GraphQLClient(API_URL, {
  headers: (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('otakuloot_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});
