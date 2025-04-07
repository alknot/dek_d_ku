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
      case Role.DEPUTY_DEAN || Role.FACULTY_STAFF:
        const duputyRequest = await db.form.update({
          where: { id: formId },
          data: {
            approveStatus: body.approveStatus ? 'PENDING_DEAN' : 'REJECTED',
            checkReject: body.approveStatus ? 'NOT_REJECTED' : 'REJECTED_DEPUTY_DEAN',
            comment: body.approveStatus ? body.comment : body.comment,
            commentedBy: body.approveStatus ? accessUser.email : accessUser.email,
          },
        });
        if (!duputyRequest)
          return NextResponse.json({ message: 'Request not found' }, { status: 404 });
        return NextResponse.json(
          { message: body.isApproved ? 'Approve success' : 'Reject success' },
          { status: 200 }
        );

      case Role.DEAN:
        const deanRequest = await db.form.update({
          where: { id: formId },
          data: {
            approveStatus: body.approveStatus ? 'PENDING_SA' : 'REJECTED',
            checkReject: body.approveStatus ? 'NOT_REJECTED' : 'REJECTED_DEAN',
            comment: body.approveStatus ? body.comment : body.comment,
            commentedBy: body.approveStatus ? accessUser.email : accessUser.email,
          },
        });
        if (!deanRequest)
          return NextResponse.json({ message: 'Request not found' }, { status: 404 });
        return NextResponse.json(
          { message: body.approveStatus ? 'Approve success' : 'Reject success' },
          { status: 200 }
        );

      case Role.SA_STAFF:
        const saRequest = await db.form.update({
          where: { id: formId },
          data: {
            approveStatus: body.approveStatus ? 'PENDING_BOARD' : 'REJECTED',
            checkReject: body.approveStatus ? 'NOT_REJECTED' : 'REJECTED_SA',
            comment: body.approveStatus ? body.comment : body.comment,
            commentedBy: body.approveStatus ? accessUser.email : accessUser.email,
          },
        });
        if (!saRequest) return NextResponse.json({ message: 'Request not found' }, { status: 404 });
        return NextResponse.json(
          { message: body.approveStatus ? 'Approve success' : 'Reject success' },
          { status: 200 }
        );
      case Role.COMMITTEE:
        const committeeRequest = await db.form.update({
          where: { id: formId },
          data: {
            approveStatus: body.approveStatus ? 'PENDING_CHAIRMAN' : 'REJECTED',
            checkReject: body.approveStatus ? 'NOT_REJECTED' : 'REJECTED_BOARD',
            comment: body.approveStatus ? body.comment : body.comment,
            commentedBy: body.approveStatus ? accessUser.email : accessUser.email,
          },
        });
        if (!committeeRequest)
          return NextResponse.json({ message: 'Request not found' }, { status: 404 });
        return NextResponse.json(
          { message: body.approveStatus ? 'Approve success' : 'Reject success' },
          { status: 200 }
        );
      case Role.CHAIRMAN:
        const chaimanRequest = await db.form.update({
          where: { id: formId },
          data: {
            approveStatus: body.approveStatus ? 'APPROVED' : 'REJECTED',
            checkReject: body.approveStatus ? 'NOT_REJECTED' : 'REJECTED',
            comment: body.approveStatus ? body.comment : body.comment,
            commentedBy: body.approveStatus ? accessUser.email : accessUser.email,
          },
        });
        if (!chaimanRequest)
          return NextResponse.json({ message: 'Request not found' }, { status: 404 });
        return NextResponse.json(
          { message: body.approveStatus ? 'Approve success' : 'Reject success' },
          { status: 200 }
        );

      default:
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
  } catch (e: any) {
    return handleError(e);
  }
}
