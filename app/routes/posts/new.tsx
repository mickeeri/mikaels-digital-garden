import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

const validatePostContent = (content: string) => {
  if (content.length < 10) {
    return "That post is too short";
  }
};

const validatePostName = (name: string) => {
  if (name.length < 3) {
    return "That post's name is too short";
  }
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    content: string | undefined;
  };
  fields?: {
    name: string;
    content: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const name = form.get("name");
  const content = form.get("content");

  if (typeof name !== "string" || typeof content !== "string") {
    return badRequest({ formError: "Form not submitted correctly" });
  }

  const fieldErrors = {
    name: validatePostName(name),
    content: validatePostContent(content),
  };

  const fields = { name, content };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const post = await db.post.create({ data: { ...fields, posterId: userId } });
  return redirect(`/posts/${post.id}`);
};

export default function NewPostRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <p>Add your post</p>
      <form method="post">
        <div>
          <label>
            Name:{" "}
            <input
              type="text"
              defaultValue={actionData?.fields?.name}
              name="name"
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              aria-errormessage={
                actionData?.fieldErrors?.name ? "name-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p className="" role="alert" id="name-error">
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            Content:{" "}
            <textarea
              defaultValue={actionData?.fields?.content}
              aria-invalid={
                Boolean(actionData?.fieldErrors?.content) || undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.content ? "content-error" : undefined
              }
              name="content"
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p className="" role="alert" id="content-error">
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p className="" role="alert">
              {actionData.formError}
            </p>
          ) : null}

          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
