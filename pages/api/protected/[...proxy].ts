import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import httpProxy from "http-proxy";


import { authOptions } from "../auth/[...nextauth]"
import { getConfig } from '@/global/config';
import { INTERNAL_API_PROXY } from '@/global/utils/constants';

const proxy = httpProxy.createProxyServer()

const { NEXT_PUBLIC_ARRANGER_API } = getConfig();

// You can export a config variable from any API route in Next.js.
// We'll use this to disable the bodyParser, otherwise Next.js
// would read and parse the entire request body before we
// can forward the request to the API. By skipping the bodyParser,
// we can just stream all requests through to the actual API.
export const config = {
	api: {
		bodyParser: false,
	},
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    let path = req.url;
    let target = "";
    if(req.url?.startsWith(INTERNAL_API_PROXY.PROTECTED_ARRANGER)){
        path = req?.url?.replace(/^\/api\/arranger\//, '') || "";;
        target = NEXT_PUBLIC_ARRANGER_API;
    } else {
        return res.status(404).end()
    }
    req.url = path;

    const session = await getServerSession(req, res, authOptions);

    if(session?.account?.accessToken) {
        req.headers['Authentication'] = "Bearer " + session?.account?.accessToken
    }

    // Don't forward cookies to the API:
    req.headers.cookie = ''

    proxy.web(req, res, {
        target ,
        changeOrigin: true 
    }, (err) => {
        if (err) {
            return res.status(500).end(err)
        }
        return res.end()
    })
}