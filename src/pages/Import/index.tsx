import filesize from 'filesize';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import alert from '../../assets/alert.svg';
import FileList from '../../components/FileList';
import Header from '../../components/Header';
import Upload from '../../components/Upload';
import api from '../../services/api';
import { Container, Footer, ImportFileContainer, Title } from './styles';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();
    uploadedFiles.forEach(uploadedFile => {
      data.append('file', uploadedFile.file);
    });
    try {
      await api.post('/transactions/import', data);
      history.push('/');
      toast.success('Data successfully imported !');
    } catch (err) {
      toast.error('Ops! an error happened');
    }
  }

  function submitFile(files: File[]): void {
    setUploadedFiles(
      files.map(file => ({
        file,
        name: file.name,
        readableSize: filesize(file.size),
      })),
    );
    // console.log(files);
    // const dados: FileProps[] = [];
    // dados.push({
    //   file: files[0],
    //   name: files[0].name,
    //   readableSize: String(files[0].size),
    // });
    // setUploadedFiles(dados);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
