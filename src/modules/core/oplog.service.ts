import moment from "moment";
import { Collection } from "mongodb";
import { IpfsClusterPinRm } from "../../common/utils.js";
import { CoreService } from "./core.service.js";

interface Activity {

    job_id: string
    previous_status: string
    status: string

    duration: number
    date: Date

    assigned_to: string;

    old_job: boolean
    meta: any
}

export class ActivityService {
    self: CoreService
    activity: Collection<Activity>;
    constructor(self) {
        this.self = self;

        this.activity = this.self.gateway.db.collection<Activity>('activity')
    }

    async changeState(args: {
        job_id: string
        new_status: string
        state?: any
        meta?: any
        assigned_to: string
    }) {
        const date = new Date()
        const action = await this.activity.findOne({
            job_id: args.job_id
        }, {
            sort: {
                date: -1
            }
        })

        const jobInfo = await this.self.gateway.jobs.findOne({
            id: args.job_id
        })

        let duration
        if(action) {
            duration = date.getTime() - action.date.getTime()
        } else {
            duration = date.getTime() - jobInfo.created_at.getTime()
        }

        let previous_status;
        if(action) {
            previous_status = action.status
        } else {
            previous_status = jobInfo.status
        }

        if(previous_status === "uploading" && action.status !== "complete") {
            try {
                await IpfsClusterPinRm(jobInfo.result.cid, {
                    
                })
            } catch {

            }
        }

        let old_job;
        if(jobInfo.created_at < moment().subtract("30", 'day').toDate()) {
            old_job = true;
        } else {
            old_job = false
        }
        
        const new_op = {
            job_id: args.job_id,
            previous_status,
            status: args.new_status,

            duration: duration / 1000,
            date,

            meta: args.meta,

            old_job,
            assigned_to: args.assigned_to
        }
        await this.activity.insertOne(new_op)
    }
}