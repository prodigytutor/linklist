import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import PageButtonsForm from "@/components/forms/PageButtonsForm";
import PageLinksForm from "@/components/forms/PageLinksForm";
import PageSettingsForm from "@/components/forms/PageSettingsForm";
import UsernameForm from "@/components/forms/UsernameForm";
import {Page} from "@/models/Page";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import cloneDeep from 'clone-deep';

export default async function AccountPage({searchParams}) {
  try {
    const session = await getServerSession(authOptions);
    console.log('session', session);
    const desiredUsername = searchParams?.desiredUsername;
    if (!session) {
      return redirect('/');
    }
    await mongoose.connect(process.env.MONGO_URI);
    const page = await Page.findOne({owner: session?.user?.email});
    console.log('page', page);
    if (!page) {
      return (
        <div>
          <UsernameForm desiredUsername={desiredUsername} />
        </div>
      );
    }

    const leanPage = cloneDeep(page.toJSON());
    leanPage._id = leanPage._id.toString();

    return (
      <>
        <PageSettingsForm page={leanPage} user={session.user} />
        <PageButtonsForm page={leanPage} user={session.user} />
        <PageLinksForm page={leanPage} user={session.user} />
      </>
    );
  } catch (error) {
    console.error("Error loading account page:", error);
    return (
      <div>
        <p>There was an error loading your account page. Please try again later.</p>
      </div>
    );
  }
}