import * as rt from "runtypes";

export const OidcLoginConfigRuntype = rt.Record({
    cloudUrl: rt.String,
    organizationName: rt.String,
    requestedTokenType: rt.String,
    scope: rt.String.Or(rt.Undefined),
    expiration: rt.Number.Or(rt.Undefined),
    exportEnvironmentVariables: rt.Boolean,
});

export type OidcLoginConfig = rt.Static<typeof OidcLoginConfigRuntype>;
