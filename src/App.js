import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FolderOutlined,
  FolderOpenOutlined,
  FileOutlined
} from "@ant-design/icons";
import "./index.css";
const SORT_OPTIONS = [
  { label: "Назва", value: "name" },
  { label: "Розмір", value: "size" },
  { label: "Дата", value: "mtime" }
];

function FilesTree() {
  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState({});
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0].value);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://prof.world/api/test_json_files/?token=6a06cc0050374e32be51125978904bd8"
        );
        setFolders(response.data.data.files);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  function sortFiles(files) {
    const sortedFiles = [...files].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return a.size - b.size;
        case "mtime":
          return a.mtime - b.mtime;
        default:
          return 0;
      }
    });
    return sortedFiles;
  }

  function renderFolder(folderName, files) {
    function handleToggleFolder() {
      setIsOpen(!isOpen);
    }

    const sortedFiles = sortFiles(files);

    return (
      <div key={folderName}>
        <div className="folder" onClick={handleToggleFolder}>
          {isOpen ? <FolderOpenOutlined /> : <FolderOutlined />} {folderName}
        </div>
        {isOpen && (
          <ul className="fiels-list">
            {sortedFiles.map((file, index) => (
              <li key={index}>
                <FileOutlined /> {file.name} ({file.size})
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  function handleSortByChange(event) {
    setSortBy(event.target.value);
  }

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div>
            Сортувати за:{" "}
            <select value={sortBy} onChange={handleSortByChange}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {Object.entries(folders).map(([folderName, files]) =>
            renderFolder(folderName, files)
          )}
        </div>
      )}
    </div>
  );
}

export default FilesTree;
