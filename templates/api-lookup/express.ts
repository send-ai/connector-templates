const express = require('express')
const app = express()
app.use(express.json())
const port = 3000

type LabelNameId = string

type LabelType =
    | 'ADDRESS'
    | 'ANY'
    | 'API_LOOKUP'
    | 'CALCULATED'
    | 'CURRENCY'
    | 'DATE_RANGE'
    | 'DATE'
    | 'DURATION'
    | 'LIST_LOOKUP'
    | 'NUMBER'
    | 'REGEX'
    | 'STRING'
    | 'TIMESPAN';


interface Label {
    id: string // internal id
    name: string // label name
    name_id: string // human readable label id
    type: LabelType
    required: boolean
    entity_id: string

    user_id?: string // initiating user

    content?: string // The original content
    start_offset?: number // The start offset of the label in the document
    end_offset?: number // The end offset of the label in the document

    value: string | null // The parsed value

    accuracy?: number
    created_at?: string // ISO date
    verified?: boolean
    hasGroup?: boolean

    // Error properties
    errorMessage: null | string
    warningMessage: null | string
}

interface LookupRequest {
    id: string // internal id
    name: string // label name
    name_id: string // human readable label id
    type: 'API_LOOKUP'
    required: boolean
    entity_id: string // internal entity id

    user_id?: string // initiating user

    content?: string // The original content
    start_offset?: number // The start offset of the label in the document
    end_offset?: number // The end offset of the label in the document

    accuracy?: number
    created_at?: string // ISO date
    verified?: boolean
    hasGroup?: boolean

    context: Record<LabelNameId, Label>
}

interface LookupResponse {
    id: string // internal id
    value: string | null
    accuracy: number | null
    errorMessage: string | null // If set the label will be marked as invalid
    warningMessage: string | null // If set a warning is shown in the user interface
}

const authorize = (req: Request) => {
    const authKey = Object.keys(req.headers).find(headerKey => headerKey.toLowerCase() === "authorization");

    if (!authKey) return false;

    const authValue = req.headers[authKey];
    // TODO Replace with your own authorization token which is set in the project settings
    return authValue === `Bearer ${process.env.AUTH_TOKEN}`;
}

/**
 * Simple verification
 */
app.post("/", (req, res) => {
    const body: LookupRequest = req.body

    // OPTIONAL: Authorize request using key in header
    if (!authorize(req)) {
        res.status(401).send({error: 'Unauthorized'})
        return
    }

    // TODO: Implement lookup logic here
    const valid = true

    if (valid) {
        const response: LookupResponse = {
            id: body.id,
            value: "Some value",
            accuracy: -1, // -1 is considered statically defined
            errorMessage: null,
            warningMessage: "The value is statically defined",
        }
        // Any response < 400 will be considered a success
        res.status(200).send(response)
    } else {
        // Any response > 400 will be considered an error
        res.status(400).send({ error: "Invalid request" })
    }
})

app.listen(port, () => {
    console.log(`Connector listening on ${port}`)
})
