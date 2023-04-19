import { Injectable } from "@nestjs/common";
import { ActiveUserData } from "src/iam/interfaces/active-user.interface";
import { PolicyHandler } from "./interfaces/policy-handler.interface";
import { Policy } from "./interfaces/policy.interface";
import { PolicyhandlerStorage } from "./policy-handlers.storage";

export class FrameworkContributorPolicy implements Policy {
    name = 'FrameworkContibutor';
};


@Injectable()
export class FrameworkContributorPolicyHandler implements PolicyHandler<FrameworkContributorPolicy>{

    constructor (private readonly policyHandlerStorage: PolicyhandlerStorage) {
        this.policyHandlerStorage.add(FrameworkContributorPolicy, this)
    }
     async handle(policy: FrameworkContributorPolicy, user: ActiveUserData): Promise<void>{
         const isContributor = user.email.endsWith('@nestjs.com');
         if(!isContributor) {
             throw new Error('User is not a contributor');
         }
     }

}

 