import dynamic from 'next/dynamic';

const RestClient = dynamic(() => import('./components/RestClient'), {
  loading: () => <div>Loading REST Client...</div>,
});

export default function Client() {
  return (
    <div className="flex flex-col min-h-screen">
      {/*TODO change with real header after (Week 1 - Task 2 - Homepage)[https://github.com/users/HelenaIsh/projects/2/views/1?pane=issue&itemId=103910391&issue=HelenaIsh%7Crest-client-app%7C3] is completed*/}
      <header>header</header>
      <main className="flex-grow container mx-auto p-4">
        <RestClient />
      </main>
      {/*TODO change with real header after (Week 1 - Task 2 - Homepage)[https://github.com/users/HelenaIsh/projects/2/views/1?pane=issue&itemId=103910391&issue=HelenaIsh%7Crest-client-app%7C3] is completed*/}
      <footer>footer</footer>
    </div>
  );
}
