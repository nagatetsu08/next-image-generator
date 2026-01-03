import { createUser, deleteUser, updateUser } from '@/lib/users'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type
    // console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    // console.log('Webhook payload:', evt.data)

    // createdイベントの時はこの処理を動かす。。。みたいないことができる
    if (evt.type === 'user.created') {

        // 分割代入の際は、オブジェクト内に存在するプロパティ名でないとだめ。
        // なので先に＝の右側を書いてやったほうがやりやすい
        const { id, email_addresses } = evt.data;
        const email = email_addresses[0].email_address

        try {
          const user = await createUser(id, email)
          return NextResponse.json({ user }, { status: 201})
        } catch(error) {
          return NextResponse.json({ error }, { status: 500 })
        }

      }

      if (evt.type === 'user.updated') {

        // 分割代入の際は、オブジェクト内に存在するプロパティ名でないとだめ。
        // なので先に＝の右側を書いてやったほうがやりやすい
        const { id, email_addresses } = evt.data;
        const email = email_addresses[0].email_address

        try {
          const user = await updateUser(id, email)
          return NextResponse.json({ user }, { status: 201})
        } catch(error) {
          return NextResponse.json({ error }, { status: 500 })
        }

      }

      if (evt.type === 'user.deleted') {

        // 分割代入の際は、オブジェクト内に存在するプロパティ名でないとだめ。
        // なので先に＝の右側を書いてやったほうがやりやすい
        const { id } = evt.data;
        
        if(!id) {
          throw new Error("Failed to Delete User")
        }

        try {
          const user = await deleteUser(id)
          return NextResponse.json({ user }, { status: 201})
        } catch(error) {
          return NextResponse.json({ error }, { status: 500 })
        }

      }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}