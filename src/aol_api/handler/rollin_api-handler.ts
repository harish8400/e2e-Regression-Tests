import { APIRequestContext } from '@playwright/test';
import { RollinApi } from '../rollin_api';

export class RollinApiHandler {

    static async createRollin(apiRequestContext: APIRequestContext,memberId?: string) {
        const rollin = new RollinApi(apiRequestContext);
        return rollin.createRollin(memberId!);
    }


}