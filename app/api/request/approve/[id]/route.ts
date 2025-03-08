import { handleError } from '@/app/libs/utils';
import { getFieldValue } from '@libs/common';
import { PrismaClient, Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { comment } from 'postcss';
import { decodeToken } from 'react-jwt';

const db = new PrismaClient();
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get('Authorization');

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

    switch (user.role) {
      // case Role.DEPARTMENT_HEAD:
      //   const deptForm = await db.form.findUnique({ where: { id: formId } });
      //   if (!deptForm) return NextResponse.json({ message: 'Request not found' }, { status: 404 });
      //   if (deptForm.approveStatus !== 'PENDING_DEPARTMENT_HEAD')
      //     return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

      //   const deptHeadRequests = await db.form.update({
      //     where: { id: formId },
      //     data: { approveStatus: body.isApproved ? 'PENDING_FACULTY' : 'REJECTED' },
      //   });
      //   if (!deptHeadRequests)
      //     return NextResponse.json({ message: 'Request not found' }, { status: 404 });
      //   return NextResponse.json(
      //     { message: body.isApproved ? 'Approve success' : 'Reject success' },
      //     { status: 200 }
      //   );
      case Role.DEPUTY_DEAN || Role.FACULTY_STAFF:
        const duputyRequest = await db.form.update({
          where: { id: formId },
          data: {
            approveStatus: body.isApproved ? 'PENDING_DEAN' : 'REJECTED',
            checkReject: body.isApproved ? 'NOT_REJECTED' : 'REJECTED_DEPUTY_DEAN',
            comment: body.isApproved ? '' : body.comment,
            commentedBy: body.isApproved ? '' : accessUser.email,
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
            approveStatus: body.isApproved ? 'PENDING_SA' : 'REJECTED',
            checkReject: body.isApproved ? 'NOT_REJECTED' : 'REJECTED_DEPUTY_DEAN',
            comment: body.isApproved ? '' : body.comment,
            commentedBy: body.isApproved ? '' : accessUser.email,
          },
        });
        if (!deanRequest)
          return NextResponse.json({ message: 'Request not found' }, { status: 404 });
        return NextResponse.json(
          { message: body.isApproved ? 'Approve success' : 'Reject success' },
          { status: 200 }
        );

      case Role.SA_STAFF:
        const saRequest = await db.form.update({
          where: { id: formId },
          data: {
            approveStatus: body.isApproved ? 'PENDING_BOARD' : 'REJECTED',
            checkReject: body.isApproved ? 'NOT_REJECTED' : 'REJECTED_SA',
            comment: body.isApproved ? '' : body.comment,
            commentedBy: body.isApproved ? '' : accessUser.email,
          },
        });
        if (!saRequest) return NextResponse.json({ message: 'Request not found' }, { status: 404 });
        return NextResponse.json(
          { message: body.isApproved ? 'Approve success' : 'Reject success' },
          { status: 200 }
        );
      case Role.COMMITTEE:
        const committeeRequest = await db.form.update({
          where: { id: formId },
          data: {
            approveStatus: body.isApproved ? 'PENDING_CHAIRMAN' : 'REJECTED',
            checkReject: body.isApproved ? 'NOT_REJECTED' : 'REJECTED_BOARD',
            comment: body.isApproved ? '' : body.comment,
            commentedBy: body.isApproved ? '' : accessUser.email,
          },
        });
        if (!committeeRequest)
          return NextResponse.json({ message: 'Request not found' }, { status: 404 });
        return NextResponse.json(
          { message: body.isApproved ? 'Approve success' : 'Reject success' },
          { status: 200 }
        );
      case Role.CHAIRMAN:
        const chaimanRequest = await db.form.update({
          where: { id: formId },
          data: {
            approveStatus: body.isApproved ? 'APPROVED' : 'REJECTED',
            checkReject: body.isApproved ? 'NOT_REJECTED' : 'REJECTED',
            comment: body.isApproved ? '' : body.comment,
            commentedBy: body.isApproved ? '' : accessUser.email,
          },
        });
        if (!chaimanRequest)
          return NextResponse.json({ message: 'Request not found' }, { status: 404 });
        return NextResponse.json(
          { message: body.isApproved ? 'Approve success' : 'Reject success' },
          { status: 200 }
        );
      default:
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
  } catch (e: any) {
    return handleError(e);
  }
}
