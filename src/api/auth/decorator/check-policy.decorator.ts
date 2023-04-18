import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

import { PolicyDefinition, UserAction } from '../auth.policy';
import {
  PolicyDefinitionConstructor,
  CHECK_POLICIES_KEY,
  PolicyGuard,
} from '../guards';

export function ApplyPolicy(
  Policy: PolicyDefinitionConstructor<PolicyDefinition>,
  action: UserAction,
) {
  return applyDecorators(
    SetMetadata(CHECK_POLICIES_KEY, [[Policy, action]]),
    UseGuards(PolicyGuard),
  );
}

export function ApplyPolicies(
  ...policyConstraints: [
    PolicyDefinitionConstructor<PolicyDefinition>,
    UserAction,
  ][]
) {
  return applyDecorators(
    SetMetadata(CHECK_POLICIES_KEY, policyConstraints),
    UseGuards(PolicyGuard),
  );
}

export function CheckPolicy(
  Policy: PolicyDefinitionConstructor<PolicyDefinition>,
  action: UserAction,
) {
  return SetMetadata(CHECK_POLICIES_KEY, [[Policy, action]]);
}

export function CheckPolicies(
  ...policyConstraints: [
    PolicyDefinitionConstructor<PolicyDefinition>,
    UserAction,
  ][]
) {
  return SetMetadata(CHECK_POLICIES_KEY, policyConstraints);
}
