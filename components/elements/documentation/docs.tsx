import { useState } from 'react'
import { navigation, DocumentationMenu } from './docMenu';

export default function Documentation() {
  const [selectedContent, setSelectedContent] = useState<React.JSX.Element>(navigation[0].content);
  return (
    <div>
      <DocumentationMenu setSelectedContent={setSelectedContent}/>
      <div>
        {selectedContent}
      </div>
    </div>
  )
}