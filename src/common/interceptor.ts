import { BadGatewayException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from 'rxjs/operators'
import { SessionManagementService } from "../session/session-management.service";
import { Exception, SessionTimeOutException } from "./exceptions";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(public sessionManagementService:SessionManagementService){}
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        let params:any=context.getArgs()       
        let responseMsg= await this.sessionManagementService.findById(params[0].user._id)
        const now = Date.now();
        if(responseMsg){
        return next.handle().pipe(
            tap((data) => console.log(`Response Lag...${Date.now() - now}ms`)),
           
        );
        }else{
            throw SessionTimeOutException()

        }
    }
        
    
}