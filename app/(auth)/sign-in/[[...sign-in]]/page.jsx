import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return(
    <section className='flex flex-1 justify-center items-center pt-44'>
      <SignIn />
    </section>
  );
}