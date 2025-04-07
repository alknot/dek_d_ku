import { handleError } from '@/app/libs/utils';
import { getFieldValue } from '@libs/common';
import { PrismaClient, Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { comment } from 'postcss';
import { decodeToken } from 'react-jwt';

const db = new PrismaClient();
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get('Authorization');
    const { searchParams } = new URL(req.url);

    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    // Do something to verify token and get id
    const user = decodeToken(token) as any;
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const accessUser = await db.user.findUnique({
      where: {
        email: user['google-mail'],
      },
    });
    if (!accessUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formId = (await params).id;
    const body = await req.json();
    // console.log(
    //   '---------------------------------------------------body------------------------------------------'
    // );
    // console.log('body', body);
    // console.log('body.approveStatus', body.approveStatus);
    // console.log('body.comment', body.comment);
    // console.log(
    //   '---------------------------------------------------body------------------------------------------'
    // );

    // const approveStatus = searchParams.get('approveStatus');
    // const comment = searchParams.get('comment');
    // console.log('approveStatus', approveStatus);
    // console.log('body.approveStatus', body.isApproved);
    // console.log('comment', comment);
    // console.log('body.comment', body.comment);
    // Validate the request body
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ message: 'Invalid or missing request body' }, { status: 400 });
    }

    const requiredFields = ['isApproved'];

    // Validate required fields
    // const missingField = requiredFields.find((field) => !getFieldValue(body, field));
    // if (missingField) {
    //   return NextResponse.json({ message: `${missingField} is missing` }, { status: 400 });
    // }
    switch (accessUser.role) {
      case Role.DEPARTMENT_HEAD:
        if (body.approveStatus === 'PENDING_DEPUTY_DEAN' || body.approveStatus === 'REJECTED') {
          const duputyRequest = await db.form.delete({
            where: { id: formId },
          });
          if (!duputyRequest)
            return NextResponse.json({ message: 'Request not found' }, { status: 404 });
          return NextResponse.json(
            //   { message: body.isApproved ? 'Approve success' : 'Reject success' },
            { status: 200 }
          );
        }
      case Role.DEPUTY_DEAN:
        if (body.approveStatus === 'PENDING_DEAN' || body.approveStatus === 'REJECTED') {
          const duputyRequest = await db.form.update({
            where: { id: formId },
            data: {
              approveStatus: 'PENDING_DEPUTY_DEAN',
              checkReject: 'NOT_REJECTED',
              comment: '',
              commentedBy: '',
            },
          });
          if (!duputyRequest)
            return NextResponse.json({ message: 'Request not found' }, { status: 404 });
          return NextResponse.json(
            //   { message: body.isApproved ? 'Approve success' : 'Reject success' },
            { status: 200 }
          );
        }
      case Role.DEAN:
        if (body.approveStatus === 'PENDING_SA' || body.approveStatus === 'REJECTED') {
          const deanRequest = await db.form.update({
            where: { id: formId },
            data: {
              approveStatus: 'PENDING_DEAN',
              checkReject: 'NOT_REJECTED',
              comment: '',
              commentedBy: '',
            },
          });
          if (!deanRequest)
            return NextResponse.json({ message: 'Request not found' }, { status: 404 });
          return NextResponse.json(
            //   { message: body.approveStatus ? 'Approve success' : 'Reject success' },
            { status: 200 }
          );
        }
      case Role.SA_STAFF:
        if (body.approveStatus === 'PENDING_BOARD' || body.approveStatus === 'REJECTED') {
          const saRequest = await db.form.update({
            where: { id: formId },
            data: {
              approveStatus: 'PENDING_SA',
              checkReject: 'NOT_REJECTED',
              comment: '',
              commentedBy: '',
            },
          });
          if (!saRequest)
            return NextResponse.json({ message: 'Request not found' }, { status: 404 });
          return NextResponse.json(
            //   { message: body.approveStatus ? 'Approve success' : 'Reject success' },
            { status: 200 }
          );
        }
      case Role.COMMITTEE:
        if (body.approveStatus === 'PENDING_CHAIRMAN' || body.approveStatus === 'REJECTED') {
          const committeeRequest = await db.form.update({
            where: { id: formId },
            data: {
              approveStatus: 'PENDING_BOARD',
              checkReject: 'NOT_REJECTED',
              comment: '',
              commentedBy: '',
            },
          });
          if (!committeeRequest)
            return NextResponse.json({ message: 'Request not found' }, { status: 404 });
          return NextResponse.json(
            //   { message: body.approveStatus ? 'Approve success' : 'Reject success' },
            { status: 200 }
          );
        }
      case Role.CHAIRMAN:
        if (body.approveStatus === 'APPROVED' || body.approveStatus === 'REJECTED') {
          const chaimanRequest = await db.form.update({
            where: { id: formId },
            data: {
              approveStatus: 'PENDING_CHAIRMAN',
              checkReject: 'NOT_REJECTED',
              comment: '',
              commentedBy: '',
            },
          });
          if (!chaimanRequest)
            return NextResponse.json({ message: 'Request not found' }, { status: 404 });
          return NextResponse.json(
            //   { message: body.approveStatus ? 'Approve success' : 'Reject success' },
            { status: 200 }
          );
        }
      default:
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
  } catch (e: any) {
    return handleError(e);
  }
}
