import { useState } from "react"
import Pagination from "../../components/Pagination/Pagination"
import SearchBox from "../../components/SearchBox/SearchBox"
import css from "./app.module.css"
import { useDebouncedCallback } from "use-debounce"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {fetchNotes} from "../../services/noteService"
import NoteList from "../../components/NoteList/NoteList"
import Modal from "../../components/Modal/Modal"
import NoteForm from "../../components/NoteForm/NoteForm"


export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 300);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    updateSearchQuery(value);
  };
  
  const {data, isLoading} = useQuery({
    queryKey: ["notes", currentPage, searchQuery],
    queryFn: () => fetchNotes(currentPage, searchQuery),
    placeholderData: keepPreviousData,
  })

  const totalPages = data?.totalPages ?? 0;



  return (
    <div className={css.app}>
	    <header className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={handleSearchChange}/>
        {totalPages > 1 && (
        <Pagination totalNumberOfPages={totalPages} currentActivePage={currentPage} setPage={setCurrentPage} />)}
		    <button className={css.button} onClick={openModal}>Create note +</button>
      </header>

      {isLoading ? (
        <p className={css.loading}>Loading notes...</p>
      ) : (
        <NoteList notes={data?.notes ?? []} />
      )}
      {isModalOpen && ( <Modal onClose={closeModal}>
        <NoteForm onCloseModal={closeModal}/>
      </Modal>
      )}
  </div>
  )
}