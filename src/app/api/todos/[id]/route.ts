import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const todo = await prisma.todo.update({
      where: {
        id,
      },
      data: {
        ...(body.title !== undefined && {
          title: body.title,
        }),

        ...(body.completed !== undefined && {
          completed: body.completed,
        }),
      },
    });

    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Update failed",
        error,
      },
      {
        status: 500,
      }
    );
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.todo.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Deleted Successfully",
    });

  } catch (error) {
    return NextResponse.json(
      {
        message: "Delete failed",
        error,
      },
      {
        status: 500,
      }
    );
  }
}
